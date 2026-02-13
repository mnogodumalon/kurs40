import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Mail, Phone, Briefcase } from 'lucide-react';
import { EntityDialog } from '@/components/EntityDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { LivingAppsService } from '@/services/livingAppsService';
import type { Dozenten } from '@/types/app';

export function DozentenTab() {
  const [dozenten, setDozenten] = useState<Dozenten[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [editData, setEditData] = useState<Dozenten | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await LivingAppsService.getDozenten();
      setDozenten(data);
    } catch (error) {
      console.error('Failed to load dozenten:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Record<string, unknown>) => {
    const payload = {
      name: data.name as string,
      email: data.email as string,
      telefon: (data.telefon as string) || null,
      fachgebiet: (data.fachgebiet as string) || null,
    };

    if (editData) {
      await LivingAppsService.updateDozenten(editData.record_id, payload);
    } else {
      await LivingAppsService.createDozenten(payload);
    }
    await loadData();
    setEditData(null);
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    await LivingAppsService.deleteDozenten(deleteDialog.id);
    await loadData();
    setDeleteDialog({ open: false, id: null });
  };

  const fields = [
    { key: 'name', label: 'Name', type: 'text' as const, required: true },
    { key: 'email', label: 'E-Mail', type: 'email' as const, required: true },
    { key: 'telefon', label: 'Telefon', type: 'text' as const },
    { key: 'fachgebiet', label: 'Fachgebiet', type: 'text' as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dozenten</h2>
          <p className="text-muted-foreground mt-1">Verwalten Sie Ihre Dozenten</p>
        </div>
        <Button variant="premium" onClick={() => { setEditData(null); setDialogOpen(true); }}>
          <Plus className="size-4" />
          Neuer Dozent
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
                <TableHead className="font-semibold">Fachgebiet</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dozenten.map((dozent) => (
                <TableRow key={dozent.record_id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{dozent.fields.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="size-4 text-muted-foreground" />
                      {dozent.fields.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {dozent.fields.telefon ? (
                      <div className="flex items-center gap-2">
                        <Phone className="size-4 text-muted-foreground" />
                        {dozent.fields.telefon}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {dozent.fields.fachgebiet ? (
                      <div className="flex items-center gap-2">
                        <Briefcase className="size-4 text-muted-foreground" />
                        {dozent.fields.fachgebiet}
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
                        onClick={() => { setEditData(dozent); setDialogOpen(true); }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteDialog({ open: true, id: dozent.record_id })}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {dozenten.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Keine Dozenten vorhanden
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
        title={editData ? 'Dozent bearbeiten' : 'Neuer Dozent'}
        fields={fields}
        initialData={editData?.fields}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={handleDelete}
        title="Dozent löschen"
        description="Möchten Sie diesen Dozenten wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
      />
    </div>
  );
}
