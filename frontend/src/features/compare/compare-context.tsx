import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { ProductTypeKey } from '../products/product-types';

const STORAGE_KEY = 'apppc.compare';
const MAX_ITEMS = 4;

interface CompareState {
  typeKey: ProductTypeKey | null;
  ids: string[];
}

interface CompareContextValue extends CompareState {
  isSelected: (id: string) => boolean;
  toggle: (typeKey: ProductTypeKey, id: string) => void;
  clear: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

function loadInitialState(): CompareState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { typeKey: null, ids: [] };
    return JSON.parse(raw) as CompareState;
  } catch {
    return { typeKey: null, ids: [] };
  }
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CompareState>(loadInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function toggle(typeKey: ProductTypeKey, id: string) {
    setState((prev) => {
      // Khác loại sản phẩm với danh sách đang so sánh -> bắt đầu lại danh sách mới.
      if (prev.typeKey !== typeKey) {
        return { typeKey, ids: [id] };
      }
      if (prev.ids.includes(id)) {
        const ids = prev.ids.filter((existing) => existing !== id);
        return { typeKey: ids.length > 0 ? typeKey : null, ids };
      }
      if (prev.ids.length >= MAX_ITEMS) {
        return prev;
      }
      return { typeKey, ids: [...prev.ids, id] };
    });
  }

  function clear() {
    setState({ typeKey: null, ids: [] });
  }

  return (
    <CompareContext.Provider
      value={{
        ...state,
        isSelected: (id) => state.ids.includes(id),
        toggle,
        clear,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare phải được dùng bên trong CompareProvider');
  return ctx;
}

export const COMPARE_MAX_ITEMS = MAX_ITEMS;
