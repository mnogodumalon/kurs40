import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: 'default' | 'hero';
}

export function StatCard({ title, value, icon: Icon, trend, variant = 'default' }: StatCardProps) {
  const isHero = variant === 'hero';

  return (
    <Card
      className={`transition-all hover:shadow-lg ${
        isHero
          ? 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground border-0 shadow-xl'
          : 'bg-card hover:border-primary/20'
      }`}
    >
      <CardContent className={`p-6 ${isHero ? 'py-8' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={`text-sm font-medium ${isHero ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {title}
            </p>
            <p className={`font-bold ${isHero ? 'text-5xl' : 'text-3xl'}`}>
              {value}
            </p>
            {trend && (
              <p className={`text-xs ${isHero ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {trend}
              </p>
            )}
          </div>
          <div className={`rounded-lg p-3 ${isHero ? 'bg-white/20' : 'bg-primary/10'}`}>
            <Icon className={`${isHero ? 'size-7 text-primary-foreground' : 'size-6 text-primary'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
