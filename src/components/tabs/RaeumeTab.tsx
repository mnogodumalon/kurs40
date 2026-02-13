import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Building2, Users } from 'lucide-react';
import { EntityDialog } from '@/components/EntityDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { LivingAppsService } from '@/services/livingAppsService';
import type { Raeume } from '@/types/app';

export function RaeumeTab() {
  const [raeume, setRaeume] = useState<Raeume[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [editData, setEditData] = useState<Raeume | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await LivingAppsService.getRaeume();
      setRaeume(data);
    } catch (error) {
      console.error('Failed to load raeume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Record<string, unknown>) => {
    const payload = {
      raumname: data.raumname as string,
      gebaeude: (data.gebaeude as string) || null,
      kapazitaet: data.kapazitaet ? Number(data.kapazitaet) : null,
    };

    if (editData) {
      await LivingAppsService.updateRaeume(editData.record_id, payload);
    } else {
      await LivingAppsService.createRaeume(payload);
    }
    await loadData();
    setEditData(null);
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    await LivingAppsService.deleteRaeume(deleteDialog.id);
    await loadData();
    setDeleteDialog({ open: false, id: null });
  };

  const fields = [
    { key: 'raumname', label: 'Raumname', type: 'text' as const, required: true },
    { key: 'gebaeude', label: 'Gebäude', type: 'text' as const },
    { key: 'kapazitaet', label: 'Kapazität', type: 'number' as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Räume</h2>
          <p className="text-muted-foreground mt-1">Verwalten Sie Ihre Räume</p>
        </div>
        <Button variant="premium" onClick={() => { setEditData(null); setDialogOpen(true); }}>
          <Plus className="size-4" />
          Neuer Raum
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Laden...</div>
      ) : (
        <div className="rounded-lg border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Raumname</TableHead>
                <TableHead className="font-semibold">Gebäude</TableHead>
                <TableHead className="font-semibold">Kapazität</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {raeume.map((raum) => (
                <TableRow key={raum.record_id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{raum.fields.raumname}</TableCell>
                  <TableCell>
                    {raum.fields.gebaeude ? (
                      <div className="flex items-center gap-2">
                        <Building2 className="size-4 text-muted-foreground" />
                        {raum.fields.gebaeude}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {raum.fields.kapazitaet ? (
                      <Badge variant="secondary" className="gap-1">
                        <Users className="size-3" />
                        {raum.fields.kapazitaet} Personen
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => { setEditData(raum); setDialogOpen(true); }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteDialog({ open: true, id: raum.record_id })}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {raeume.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Keine Räume vorhanden
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
        title={editData ? 'Raum bearbeiten' : 'Neuer Raum'}
        fields={fields}
        initialData={editData?.fields}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={handleDelete}
        title="Raum löschen"
        description="Möchten Sie diesen Raum wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
      />
    </div>
  );
}
