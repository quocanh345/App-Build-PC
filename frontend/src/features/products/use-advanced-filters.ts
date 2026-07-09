import { useMemo, useState } from 'react';
import type { Product } from './api';
import type { FilterFieldDef } from './filter-fields';

export interface FieldMeta {
  discreteOptions?: string[];
  rangeBounds?: [number, number];
}

function computeFieldMeta(
  products: Product[],
  fields: FilterFieldDef[],
): Record<string, FieldMeta> {
  const meta: Record<string, FieldMeta> = {};
  for (const field of fields) {
    const rawValues = products.map((p) => p[field.name]);
    if (field.kind === 'discrete') {
      const unique = Array.from(new Set(rawValues.map((v) => String(v))));
      unique.sort((a, b) => {
        const na = Number(a);
        const nb = Number(b);
        if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
        return a.localeCompare(b);
      });
      meta[field.name] = { discreteOptions: unique };
    } else {
      const nums = rawValues.map((v) => Number(v)).filter((n) => !Number.isNaN(n));
      const min = nums.length ? Math.min(...nums) : 0;
      const max = nums.length ? Math.max(...nums) : 0;
      meta[field.name] = { rangeBounds: [min, max] };
    }
  }
  return meta;
}

export function useAdvancedProductFilters(
  products: Product[] | undefined,
  fields: FilterFieldDef[],
) {
  const [search, setSearch] = useState('');
  const [discreteSelections, setDiscreteSelections] = useState<
    Record<string, string[]>
  >({});
  const [rangeSelections, setRangeSelections] = useState<
    Record<string, [number, number]>
  >({});

  const fieldMeta = useMemo(
    () => (products ? computeFieldMeta(products, fields) : {}),
    [products, fields],
  );

  const filtered = useMemo(() => {
    if (!products) return products;
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      if (term && !product.name.toLowerCase().includes(term)) return false;

      for (const field of fields) {
        if (field.kind === 'discrete') {
          const selected = discreteSelections[field.name];
          if (selected && selected.length > 0) {
            if (!selected.includes(String(product[field.name]))) return false;
          }
        } else {
          const range = rangeSelections[field.name];
          const bounds = fieldMeta[field.name]?.rangeBounds;
          if (range && bounds && (range[0] !== bounds[0] || range[1] !== bounds[1])) {
            const value = Number(product[field.name]);
            if (value < range[0] || value > range[1]) return false;
          }
        }
      }
      return true;
    });
  }, [products, fields, search, discreteSelections, rangeSelections, fieldMeta]);

  function toggleDiscrete(fieldName: string, value: string) {
    setDiscreteSelections((prev) => {
      const current = prev[fieldName] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [fieldName]: next };
    });
  }

  function setRange(fieldName: string, range: [number, number]) {
    setRangeSelections((prev) => ({ ...prev, [fieldName]: range }));
  }

  function resetFilters() {
    setDiscreteSelections({});
    setRangeSelections({});
  }

  const activeFilterCount =
    Object.values(discreteSelections).filter((v) => v.length > 0).length +
    Object.entries(rangeSelections).filter(([name, range]) => {
      const bounds = fieldMeta[name]?.rangeBounds;
      return bounds && (range[0] !== bounds[0] || range[1] !== bounds[1]);
    }).length;

  return {
    search,
    setSearch,
    fieldMeta,
    discreteSelections,
    rangeSelections,
    toggleDiscrete,
    setRange,
    resetFilters,
    activeFilterCount,
    filtered,
  };
}
