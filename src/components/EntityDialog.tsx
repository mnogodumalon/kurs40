import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FieldConfig = {
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox';
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
};

interface EntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  title: string;
  description?: string;
  fields: FieldConfig[];
  initialData?: Record<string, unknown>;
}

export function EntityDialog({ open, onOpenChange, onSave, title, description, fields, initialData }: EntityDialogProps) {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    } else {
      setData({});
    }
  }, [initialData, open]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(data);
      onOpenChange(false);
      setData({});
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.key} className="grid gap-2">
              <Label htmlFor={field.key} className="font-medium">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.key}
                  value={(data[field.key] as string) || ''}
                  onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
                  rows={4}
                />
              ) : field.type === 'select' && field.options ? (
                <Select
                  value={(data[field.key] as string) || undefined}
                  onValueChange={(value) => setData({ ...data, [field.key]: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`${field.label} auswählen...`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={field.key}
                    checked={(data[field.key] as boolean) || false}
                    onChange={(e) => setData({ ...data, [field.key]: e.target.checked })}
                    className="size-4 rounded border-input"
                  />
                  <Label htmlFor={field.key} className="font-normal cursor-pointer">
                    {field.label}
                  </Label>
                </div>
              ) : (
                <Input
                  id={field.key}
                  type={field.type}
                  value={(data[field.key] as string | number) || ''}
                  onChange={(e) => {
                    const value = field.type === 'number' ? (e.target.value === '' ? null : parseFloat(e.target.value)) : e.target.value;
                    setData({ ...data, [field.key]: value });
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} disabled={loading} variant="premium">
            {loading ? 'Speichern...' : 'Speichern'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
