import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/StatCard';
import { BookOpen, Users, MapPin, User, ClipboardList } from 'lucide-react';
import { KurseTab } from '@/components/tabs/KurseTab';
import { DozentenTab } from '@/components/tabs/DozentenTab';
import { RaeumeTab } from '@/components/tabs/RaeumeTab';
import { TeilnehmerTab } from '@/components/tabs/TeilnehmerTab';
import { AnmeldungenTab } from '@/components/tabs/AnmeldungenTab';
import { LivingAppsService } from '@/services/livingAppsService';

export default function Dashboard() {
  const [stats, setStats] = useState({
    kurse: 0,
    dozenten: 0,
    raeume: 0,
    teilnehmer: 0,
    anmeldungen: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [kurse, dozenten, raeume, teilnehmer, anmeldungen] = await Promise.all([
        LivingAppsService.getKurse(),
        LivingAppsService.getDozenten(),
        LivingAppsService.getRaeume(),
        LivingAppsService.getTeilnehmer(),
        LivingAppsService.getAnmeldungen(),
      ]);

      setStats({
        kurse: kurse.length,
        dozenten: dozenten.length,
        raeume: raeume.length,
        teilnehmer: teilnehmer.length,
        anmeldungen: anmeldungen.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary to-primary-glow bg-clip-text text-transparent">
            Kursverwaltung
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Verwaltungssystem für Kurse, Dozenten und Teilnehmer
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <StatCard title="Kurse" value={stats.kurse} icon={BookOpen} variant="hero" />
          <StatCard title="Dozenten" value={stats.dozenten} icon={User} />
          <StatCard title="Räume" value={stats.raeume} icon={MapPin} />
          <StatCard title="Teilnehmer" value={stats.teilnehmer} icon={Users} />
          <StatCard title="Anmeldungen" value={stats.anmeldungen} icon={ClipboardList} />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="kurse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid bg-card shadow-sm">
            <TabsTrigger value="kurse" className="gap-2">
              <BookOpen className="size-4" />
              <span className="hidden sm:inline">Kurse</span>
            </TabsTrigger>
            <TabsTrigger value="dozenten" className="gap-2">
              <User className="size-4" />
              <span className="hidden sm:inline">Dozenten</span>
            </TabsTrigger>
            <TabsTrigger value="raeume" className="gap-2">
              <MapPin className="size-4" />
              <span className="hidden sm:inline">Räume</span>
            </TabsTrigger>
            <TabsTrigger value="teilnehmer" className="gap-2">
              <Users className="size-4" />
              <span className="hidden sm:inline">Teilnehmer</span>
            </TabsTrigger>
            <TabsTrigger value="anmeldungen" className="gap-2">
              <ClipboardList className="size-4" />
              <span className="hidden sm:inline">Anmeldungen</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kurse">
            <KurseTab />
          </TabsContent>
          <TabsContent value="dozenten">
            <DozentenTab />
          </TabsContent>
          <TabsContent value="raeume">
            <RaeumeTab />
          </TabsContent>
          <TabsContent value="teilnehmer">
            <TeilnehmerTab />
          </TabsContent>
          <TabsContent value="anmeldungen">
            <AnmeldungenTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
