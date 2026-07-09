import type { Product } from '@/features/products/api';
import type { ProductTypeKey } from '@/features/products/product-types';

export interface CompatibilityIssue {
  severity: 'error' | 'warning';
  message: string;
}

const FORM_FACTOR_RANK: Record<string, number> = {
  'Mini-ITX': 1,
  mATX: 2,
  ATX: 3,
  'E-ATX': 4,
};

// Công suất khuyến nghị = tổng TDP/TGP các linh kiện tiêu thụ nhiều điện nhất + phần dư
// cho các linh kiện còn lại (RAM, ổ cứng, quạt...).
const POWER_HEADROOM_WATT = 150;

function isCoolerSocketCompatible(cooler: Product, cpu: Product): boolean {
  const support = String(cooler.socketSupport ?? '');
  const socket = String(cpu.socket ?? '');
  if (support.includes(socket)) return true;
  if (socket.startsWith('LGA') && support.includes('Intel')) return true;
  if (socket.startsWith('AM') && support.includes('AMD')) return true;
  return false;
}

export function checkCompatibility(
  selections: Partial<Record<ProductTypeKey, { product: Product; quantity: number }>>,
): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  const cpu = selections.cpu?.product;
  const mainboard = selections.mainboard?.product;
  const ram = selections.ram?.product;
  const vga = selections.vga?.product;
  const psu = selections.psu?.product;
  const cooler = selections.cooler?.product;
  const pcCase = selections.case?.product;

  if (cpu && mainboard && cpu.socket !== mainboard.socket) {
    issues.push({
      severity: 'error',
      message: `CPU socket ${cpu.socket} không khớp với Mainboard (socket ${mainboard.socket}).`,
    });
  }

  if (ram && mainboard && ram.standard !== mainboard.memoryType) {
    issues.push({
      severity: 'error',
      message: `RAM chuẩn ${ram.standard} không tương thích — Mainboard chỉ hỗ trợ ${mainboard.memoryType}.`,
    });
  }

  if (cooler && cpu && !isCoolerSocketCompatible(cooler, cpu)) {
    issues.push({
      severity: 'error',
      message: `Tản nhiệt không hỗ trợ socket ${cpu.socket} của CPU đã chọn.`,
    });
  }

  if (mainboard && pcCase) {
    const mbRank = FORM_FACTOR_RANK[String(mainboard.formFactor)] ?? 0;
    const caseRank = FORM_FACTOR_RANK[String(pcCase.formFactor)] ?? 0;
    if (mbRank > caseRank) {
      issues.push({
        severity: 'error',
        message: `Mainboard ${mainboard.formFactor} không vừa Case ${pcCase.formFactor} (case quá nhỏ).`,
      });
    }
  }

  const totalPower = Number(cpu?.tdp ?? 0) + Number(vga?.tgp ?? 0);
  if (psu && totalPower > 0) {
    const recommended = totalPower + POWER_HEADROOM_WATT;
    if (Number(psu.wattage) < recommended) {
      issues.push({
        severity: 'warning',
        message: `Nguồn ${psu.wattage}W có thể không đủ — khuyến nghị tối thiểu ${recommended}W (CPU ${cpu?.tdp}W + VGA ${vga?.tgp}W + dự phòng ${POWER_HEADROOM_WATT}W).`,
      });
    }
  }

  return issues;
}
