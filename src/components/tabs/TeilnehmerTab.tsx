import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Mail, Phone, Cake } from 'lucide-react';
import { EntityDialog } from '@/components/EntityDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { LivingAppsService } from '@/services/livingAppsService';
import type { Teilnehmer } from '@/types/app';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export function TeilnehmerTab() {
  const [teilnehmer, setTeilnehmer] = useState<Teilnehmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [editData, setEditData] = useState<Teilnehmer | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await LivingAppsService.getTeilnehmer();
      setTeilnehmer(data);
    } catch (error) {
      console.error('Failed to load teilnehmer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Record<string, unknown>) => {
    const payload = {
      name: data.name as string,
      email: data.email as string,
      telefon: (data.telefon as string) || null,
      geburtsdatum: (data.geburtsdatum as string) || null,
    };

    if (editData) {
      await LivingAppsService.updateTeilnehmer(editData.record_id, payload);
    } else {
      await LivingAppsService.createTeilnehmer(payload);
    }
    await loadData();
    setEditData(null);
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    await LivingAppsService.deleteTeilnehmer(deleteDialog.id);
    await loadData();
    setDeleteDialog({ open: false, id: null });
  };

  const fields = [
    { key: 'name', label: 'Name', type: 'text' as const, required: true },
    { key: 'email', label: 'E-Mail', type: 'email' as const, required: true },
    { key: 'telefon', label: 'Telefon', type: 'text' as const },
    { key: 'geburtsdatum', label: 'Geburtsdatum', type: 'date' as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teilnehmer</h2>
          <p className="text-muted-foreground mt-1">Verwalten Sie Ihre Teilnehmer</p>
        </div>
        <Button variant="premium" onClick={() => { setEditData(null); setDialogOpen(true); }}>
          <Plus className="size-4" />
          Neuer Teilnehmer
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Laden...</div>
      ) : (
        <div className="rounded-lg border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">E-Mail</TableHead>
                <TableHead className="font-semibold">Telefon</TableHead>
                <TableHead className="font-semibold">Geburtsdatum</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teilnehmer.map((person) => (
                <TableRow key={person.record_id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{person.fields.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="size-4 text-muted-foreground" />
                      {person.fields.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {person.fields.telefon ? (
                      <div className="flex items-center gap-2">
                        <Phone className="size-4 text-muted-foreground" />
                        {person.fields.telefon}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {person.fields.geburtsdatum ? (
                      <div className="flex items-center gap-2">
                        <Cake className="size-4 text-muted-foreground" />
                        {format(new Date(person.fields.geburtsdatum), 'dd.MM.yyyy', { locale: de })}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => { setEditData(person); setDialogOpen(true); }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteDialog({ open: true, id: person.record_id })}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {teilnehmer.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Keine Teilnehmer vorhanden
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <EntityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        title={editData ? 'Teilnehmer bearbeiten' : 'Neuer Teilnehmer'}
        fields={fields}
        initialData={editData?.fields}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={handleDelete}
        title="Teilnehmer löschen"
        description="Möchten Sie diesen Teilnehmer wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
      />
    </div>
  );
}
