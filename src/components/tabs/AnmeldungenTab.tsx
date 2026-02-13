import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { EntityDialog } from '@/components/EntityDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { LivingAppsService, extractRecordId, createRecordUrl } from '@/services/livingAppsService';
import { APP_IDS } from '@/types/app';
import type { Anmeldungen, Teilnehmer, Kurse } from '@/types/app';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export function AnmeldungenTab() {
  const [anmeldungen, setAnmeldungen] = useState<Anmeldungen[]>([]);
  const [teilnehmer, setTeilnehmer] = useState<Teilnehmer[]>([]);
  const [kurse, setKurse] = useState<Kurse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [editData, setEditData] = useState<Anmeldungen | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [anmeldungData, teilnehmerData, kursData] = await Promise.all([
        LivingAppsService.getAnmeldungen(),
        LivingAppsService.getTeilnehmer(),
        LivingAppsService.getKurse(),
      ]);
      setAnmeldungen(anmeldungData);
      setTeilnehmer(teilnehmerData);
      setKurse(kursData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Record<string, unknown>) => {
    const payload = {
      teilnehmer: createRecordUrl(APP_IDS.TEILNEHMER, data.teilnehmer as string),
      kurs: createRecordUrl(APP_IDS.KURSE, data.kurs as string),
      anmeldedatum: data.anmeldedatum as string,
      bezahlt: (data.bezahlt as boolean) || false,
    };

    if (editData) {
      await LivingAppsService.updateAnmeldungen(editData.record_id, payload);
    } else {
      await LivingAppsService.createAnmeldungen(payload);
    }
    await loadData();
    setEditData(null);
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    await LivingAppsService.deleteAnmeldungen(deleteDialog.id);
    await loadData();
    setDeleteDialog({ open: false, id: null });
  };

  const getTeilnehmerName = (url: string | null) => {
    const id = extractRecordId(url);
    const person = teilnehmer.find((t) => t.record_id === id);
    return person?.fields.name || 'Unbekannt';
  };

  const getKursName = (url: string | null) => {
    const id = extractRecordId(url);
    const kurs = kurse.find((k) => k.record_id === id);
    return kurs?.fields.titel || 'Unbekannt';
  };

  const fields = [
    {
      key: 'teilnehmer',
      label: 'Teilnehmer',
      type: 'select' as const,
      required: true,
      options: teilnehmer.map((t) => ({ value: t.record_id, label: t.fields.name || '' })),
    },
    {
      key: 'kurs',
      label: 'Kurs',
      type: 'select' as const,
      required: true,
      options: kurse.map((k) => ({ value: k.record_id, label: k.fields.titel || '' })),
    },
    { key: 'anmeldedatum', label: 'Anmeldedatum', type: 'date' as const, required: true },
    { key: 'bezahlt', label: 'Bezahlt', type: 'checkbox' as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Anmeldungen</h2>
          <p className="text-muted-foreground mt-1">Verwalten Sie Kursanmeldungen</p>
        </div>
        <Button variant="premium" onClick={() => { setEditData(null); setDialogOpen(true); }}>
          <Plus className="size-4" />
          Neue Anmeldung
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Laden...</div>
      ) : (
        <div className="rounded-lg border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Teilnehmer</TableHead>
                <TableHead className="font-semibold">Kurs</TableHead>
                <TableHead className="font-semibold">Anmeldedatum</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {anmeldungen.map((anmeldung) => (
                <TableRow key={anmeldung.record_id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{getTeilnehmerName(anmeldung.fields.teilnehmer)}</TableCell>
                  <TableCell>{getKursName(anmeldung.fields.kurs)}</TableCell>
                  <TableCell>
                    {anmeldung.fields.anmeldedatum && (
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        {format(new Date(anmeldung.fields.anmeldedatum), 'dd.MM.yyyy', { locale: de })}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {anmeldung.fields.bezahlt ? (
                      <Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600">
                        <CheckCircle2 className="size-3" />
                        Bezahlt
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <XCircle className="size-3" />
                        Offen
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setEditData({
                            ...anmeldung,
                            fields: {
                              ...anmeldung.fields,
                              teilnehmer: extractRecordId(anmeldung.fields.teilnehmer),
                              kurs: extractRecordId(anmeldung.fields.kurs),
                            },
                          });
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteDialog({ open: true, id: anmeldung.record_id })}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {anmeldungen.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Keine Anmeldungen vorhanden
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
        title={editData ? 'Anmeldung bearbeiten' : 'Neue Anmeldung'}
        fields={fields}
        initialData={editData?.fields}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={handleDelete}
        title="Anmeldung löschen"
        description="Möchten Sie diese Anmeldung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
      />
    </div>
  );
}
