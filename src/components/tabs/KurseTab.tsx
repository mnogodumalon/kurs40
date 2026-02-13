import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Calendar, Users, DollarSign, MapPin, User } from 'lucide-react';
import { EntityDialog } from '@/components/EntityDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { LivingAppsService, extractRecordId, createRecordUrl } from '@/services/livingAppsService';
import { APP_IDS } from '@/types/app';
import type { Kurse, Dozenten, Raeume } from '@/types/app';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export function KurseTab() {
  const [kurse, setKurse] = useState<Kurse[]>([]);
  const [dozenten, setDozenten] = useState<Dozenten[]>([]);
  const [raeume, setRaeume] = useState<Raeume[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [editData, setEditData] = useState<Kurse | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [kursData, dozentData, raumData] = await Promise.all([
        LivingAppsService.getKurse(),
        LivingAppsService.getDozenten(),
        LivingAppsService.getRaeume(),
      ]);
      setKurse(kursData);
      setDozenten(dozentData);
      setRaeume(raumData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Record<string, unknown>) => {
    const payload = {
      titel: data.titel as string,
      beschreibung: (data.beschreibung as string) || null,
      startdatum: data.startdatum as string,
      enddatum: data.enddatum as string,
      max_teilnehmer: data.max_teilnehmer ? Number(data.max_teilnehmer) : null,
      preis: data.preis ? Number(data.preis) : null,
      dozent: data.dozent ? createRecordUrl(APP_IDS.DOZENTEN, data.dozent as string) : null,
      raum: data.raum ? createRecordUrl(APP_IDS.RAEUME, data.raum as string) : null,
    };

    if (editData) {
      await LivingAppsService.updateKurse(editData.record_id, payload);
    } else {
      await LivingAppsService.createKurse(payload);
    }
    await loadData();
    setEditData(null);
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    await LivingAppsService.deleteKurse(deleteDialog.id);
    await loadData();
    setDeleteDialog({ open: false, id: null });
  };

  const getDozentName = (url: string | null) => {
    const id = extractRecordId(url);
    const dozent = dozenten.find((d) => d.record_id === id);
    return dozent?.fields.name || 'Nicht zugewiesen';
  };

  const getRaumName = (url: string | null) => {
    const id = extractRecordId(url);
    const raum = raeume.find((r) => r.record_id === id);
    return raum?.fields.raumname || 'Kein Raum';
  };

  const fields = [
    { key: 'titel', label: 'Titel', type: 'text' as const, required: true },
    { key: 'beschreibung', label: 'Beschreibung', type: 'textarea' as const },
    { key: 'startdatum', label: 'Startdatum', type: 'date' as const, required: true },
    { key: 'enddatum', label: 'Enddatum', type: 'date' as const, required: true },
    { key: 'max_teilnehmer', label: 'Max. Teilnehmer', type: 'number' as const },
    { key: 'preis', label: 'Preis (€)', type: 'number' as const },
    {
      key: 'dozent',
      label: 'Dozent',
      type: 'select' as const,
      options: dozenten.map((d) => ({ value: d.record_id, label: d.fields.name || '' })),
    },
    {
      key: 'raum',
      label: 'Raum',
      type: 'select' as const,
      options: raeume.map((r) => ({ value: r.record_id, label: r.fields.raumname || '' })),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kurse</h2>
          <p className="text-muted-foreground mt-1">Verwalten Sie Ihre Kursangebote</p>
        </div>
        <Button variant="premium" onClick={() => { setEditData(null); setDialogOpen(true); }}>
          <Plus className="size-4" />
          Neuer Kurs
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Laden...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {kurse.map((kurs) => (
            <Card key={kurs.record_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-1">{kurs.fields.titel}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setEditData({
                          ...kurs,
                          fields: {
                            ...kurs.fields,
                            dozent: extractRecordId(kurs.fields.dozent),
                            raum: extractRecordId(kurs.fields.raum),
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
                      onClick={() => setDeleteDialog({ open: true, id: kurs.record_id })}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {kurs.fields.beschreibung && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{kurs.fields.beschreibung}</p>
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-primary" />
                    <span>
                      {kurs.fields.startdatum && format(new Date(kurs.fields.startdatum), 'dd.MM.yyyy', { locale: de })}
                      {' - '}
                      {kurs.fields.enddatum && format(new Date(kurs.fields.enddatum), 'dd.MM.yyyy', { locale: de })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-primary" />
                    <span>{getDozentName(kurs.fields.dozent)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-primary" />
                    <span>{getRaumName(kurs.fields.raum)}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {kurs.fields.max_teilnehmer && (
                      <Badge variant="secondary" className="gap-1">
                        <Users className="size-3" />
                        Max. {kurs.fields.max_teilnehmer}
                      </Badge>
                    )}
                    {kurs.fields.preis && (
                      <Badge variant="secondary" className="gap-1">
                        <DollarSign className="size-3" />
                        {kurs.fields.preis}€
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <EntityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        title={editData ? 'Kurs bearbeiten' : 'Neuer Kurs'}
        fields={fields}
        initialData={editData?.fields}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={handleDelete}
        title="Kurs löschen"
        description="Möchten Sie diesen Kurs wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
      />
    </div>
  );
}
