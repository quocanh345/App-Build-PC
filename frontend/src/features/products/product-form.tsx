import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ProductFieldDef } from './product-types';

function buildSchema(fields: ProductFieldDef[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    shape[field.name] =
      field.kind === 'text'
        ? z.string().min(1, `${field.label} không được để trống`)
        : z.coerce.number({ message: `${field.label} phải là số` });
  }
  return z.object(shape);
}

export function ProductForm({
  fields,
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = 'Lưu',
}: {
  fields: ProductFieldDef[];
  defaultValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}) {
  const schema = useMemo(() => buildSchema(fields), [fields]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid max-h-[70vh] grid-cols-2 gap-4 overflow-y-auto p-1"
    >
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1.5">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            type={field.kind === 'text' ? 'text' : 'number'}
            step={field.kind === 'float' ? '0.1' : '1'}
            {...register(field.name)}
          />
          {errors[field.name] && (
            <p className="text-sm text-destructive">
              {String(errors[field.name]?.message)}
            </p>
          )}
        </div>
      ))}
      <div className="col-span-2 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
