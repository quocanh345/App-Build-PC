import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverHeader,
  PopoverTitle,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { FilterFieldDef } from './filter-fields';
import type { FieldMeta } from './use-advanced-filters';

function formatValue(value: string, unit?: string) {
  if (value === '') return 'Không có';
  return unit ? `${value} ${unit}` : value;
}

function DiscreteFilterField({
  field,
  options,
  selected,
  onToggle,
}: {
  field: FilterFieldDef;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (options.length <= 1) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium">{field.label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isActive = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs transition-colors',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input bg-transparent text-foreground hover:bg-accent',
              )}
            >
              {formatValue(option, field.unit)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RangeFilterField({
  field,
  bounds,
  value,
  onChange,
}: {
  field: FilterFieldDef;
  bounds: [number, number];
  value: [number, number];
  onChange: (range: [number, number]) => void;
}) {
  if (bounds[0] === bounds[1]) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <p className="font-medium">{field.label}</p>
        <p className="text-muted-foreground">
          {value[0]}
          {field.unit ? ` ${field.unit}` : ''} — {value[1]}
          {field.unit ? ` ${field.unit}` : ''}
        </p>
      </div>
      <Slider
        min={bounds[0]}
        max={bounds[1]}
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
      />
    </div>
  );
}

export function ProductFilterPanel({
  fields,
  fieldMeta,
  discreteSelections,
  rangeSelections,
  onToggleDiscrete,
  onSetRange,
  onReset,
  activeFilterCount,
}: {
  fields: FilterFieldDef[];
  fieldMeta: Record<string, FieldMeta>;
  discreteSelections: Record<string, string[]>;
  rangeSelections: Record<string, [number, number]>;
  onToggleDiscrete: (fieldName: string, value: string) => void;
  onSetRange: (fieldName: string, range: [number, number]) => void;
  onReset: () => void;
  activeFilterCount: number;
}) {
  const basicFields = fields.filter((f) => f.category === 'basic');
  const advancedFields = fields.filter((f) => f.category === 'advanced');

  function renderField(field: FilterFieldDef) {
    const meta = fieldMeta[field.name];
    if (!meta) return null;

    if (field.kind === 'discrete' && meta.discreteOptions) {
      return (
        <DiscreteFilterField
          key={field.name}
          field={field}
          options={meta.discreteOptions}
          selected={discreteSelections[field.name] ?? []}
          onToggle={(value) => onToggleDiscrete(field.name, value)}
        />
      );
    }

    if (field.kind === 'range' && meta.rangeBounds) {
      return (
        <RangeFilterField
          key={field.name}
          field={field}
          bounds={meta.rangeBounds}
          value={rangeSelections[field.name] ?? meta.rangeBounds}
          onChange={(range) => onSetRange(field.name, range)}
        />
      );
    }

    return null;
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" className="gap-2">
            <Filter className="size-4" />
            Bộ lọc
            {activeFilterCount > 0 && (
              <Badge className="h-5 min-w-5 justify-center rounded-full px-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-[380px] max-h-[70vh] overflow-y-auto" align="start">
        <PopoverHeader className="flex-row items-center justify-between">
          <PopoverTitle>Bộ lọc sản phẩm</PopoverTitle>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset} className="gap-1">
              <X className="size-3.5" />
              Xoá lọc
            </Button>
          )}
        </PopoverHeader>

        <Tabs defaultValue="basic">
          <TabsList className="w-full">
            <TabsTrigger value="basic" className="flex-1">
              Cơ bản
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1">
              Nâng cao
            </TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="flex flex-col gap-4 pt-3">
            {basicFields.map(renderField)}
          </TabsContent>
          <TabsContent value="advanced" className="flex flex-col gap-4 pt-3">
            {advancedFields.map(renderField)}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
