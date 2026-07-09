import { Injectable } from '@nestjs/common';
import { CpuRepository } from './repositories/cpu.repository';
import { RamRepository } from './repositories/ram.repository';
import { VgaRepository } from './repositories/vga.repository';
import { MainboardRepository } from './repositories/mainboard.repository';
import { PsuRepository } from './repositories/psu.repository';
import { CoolerRepository } from './repositories/cooler.repository';
import { CaseRepository } from './repositories/case.repository';
import { SsdRepository } from './repositories/ssd.repository';
import { Cpu } from './entities/cpu.entity';
import { Ram } from './entities/ram.entity';
import { Vga } from './entities/vga.entity';
import { Mainboard } from './entities/mainboard.entity';
import { Psu } from './entities/psu.entity';
import { Cooler } from './entities/cooler.entity';
import { Case } from './entities/case.entity';
import { Ssd } from './entities/ssd.entity';
import {
  CpuFilter,
  RamFilter,
  VgaFilter,
  MainboardFilter,
  PsuFilter,
  CoolerFilter,
  CaseFilter,
  SsdFilter,
} from './product.type';
import { CreateCpuInput, UpdateCpuInput } from './dto/cpu.input';
import { CreateRamInput, UpdateRamInput } from './dto/ram.input';
import { CreateVgaInput, UpdateVgaInput } from './dto/vga.input';
import {
  CreateMainboardInput,
  UpdateMainboardInput,
} from './dto/mainboard.input';
import { CreatePsuInput, UpdatePsuInput } from './dto/psu.input';
import { CreateCoolerInput, UpdateCoolerInput } from './dto/cooler.input';
import { CreateCaseInput, UpdateCaseInput } from './dto/case.input';
import { CreateSsdInput, UpdateSsdInput } from './dto/ssd.input';

@Injectable()
export class ProductService {
  constructor(
    private readonly cpuRepository: CpuRepository,
    private readonly ramRepository: RamRepository,
    private readonly vgaRepository: VgaRepository,
    private readonly mainboardRepository: MainboardRepository,
    private readonly psuRepository: PsuRepository,
    private readonly coolerRepository: CoolerRepository,
    private readonly caseRepository: CaseRepository,
    private readonly ssdRepository: SsdRepository,
  ) {}

  // ─── CPU ───────────────────────────────────────────────

  getAllCpu(): Promise<Cpu[]> {
    return this.cpuRepository.findAll();
  }

  getCpuById(id: string): Promise<Cpu> {
    return this.cpuRepository.findById(id);
  }

  filterCpu(filter: CpuFilter): Promise<Cpu[]> {
    return this.cpuRepository.filter(filter);
  }

  createCpu(input: CreateCpuInput): Promise<Cpu> {
    return this.cpuRepository.create(input);
  }

  updateCpu(id: string, input: UpdateCpuInput): Promise<Cpu> {
    return this.cpuRepository.update(id, input);
  }

  removeCpu(id: string): Promise<Cpu> {
    return this.cpuRepository.remove(id);
  }

  // ─── RAM ───────────────────────────────────────────────

  getAllRam(): Promise<Ram[]> {
    return this.ramRepository.findAll();
  }

  getRamById(id: string): Promise<Ram> {
    return this.ramRepository.findById(id);
  }

  filterRam(filter: RamFilter): Promise<Ram[]> {
    return this.ramRepository.filter(filter);
  }

  createRam(input: CreateRamInput): Promise<Ram> {
    return this.ramRepository.create(input);
  }

  updateRam(id: string, input: UpdateRamInput): Promise<Ram> {
    return this.ramRepository.update(id, input);
  }

  removeRam(id: string): Promise<Ram> {
    return this.ramRepository.remove(id);
  }

  // ─── VGA ───────────────────────────────────────────────

  getAllVga(): Promise<Vga[]> {
    return this.vgaRepository.findAll();
  }

  getVgaById(id: string): Promise<Vga> {
    return this.vgaRepository.findById(id);
  }

  filterVga(filter: VgaFilter): Promise<Vga[]> {
    return this.vgaRepository.filter(filter);
  }

  createVga(input: CreateVgaInput): Promise<Vga> {
    return this.vgaRepository.create(input);
  }

  updateVga(id: string, input: UpdateVgaInput): Promise<Vga> {
    return this.vgaRepository.update(id, input);
  }

  removeVga(id: string): Promise<Vga> {
    return this.vgaRepository.remove(id);
  }

  // ─── MAINBOARD ─────────────────────────────────────────

  getAllMainboard(): Promise<Mainboard[]> {
    return this.mainboardRepository.findAll();
  }

  getMainboardById(id: string): Promise<Mainboard> {
    return this.mainboardRepository.findById(id);
  }

  filterMainboard(filter: MainboardFilter): Promise<Mainboard[]> {
    return this.mainboardRepository.filter(filter);
  }

  createMainboard(input: CreateMainboardInput): Promise<Mainboard> {
    return this.mainboardRepository.create(input);
  }

  updateMainboard(id: string, input: UpdateMainboardInput): Promise<Mainboard> {
    return this.mainboardRepository.update(id, input);
  }

  removeMainboard(id: string): Promise<Mainboard> {
    return this.mainboardRepository.remove(id);
  }

  // ─── PSU ───────────────────────────────────────────────

  getAllPsu(): Promise<Psu[]> {
    return this.psuRepository.findAll();
  }

  getPsuById(id: string): Promise<Psu> {
    return this.psuRepository.findById(id);
  }

  filterPsu(filter: PsuFilter): Promise<Psu[]> {
    return this.psuRepository.filter(filter);
  }

  createPsu(input: CreatePsuInput): Promise<Psu> {
    return this.psuRepository.create(input);
  }

  updatePsu(id: string, input: UpdatePsuInput): Promise<Psu> {
    return this.psuRepository.update(id, input);
  }

  removePsu(id: string): Promise<Psu> {
    return this.psuRepository.remove(id);
  }

  // ─── COOLER ────────────────────────────────────────────

  getAllCooler(): Promise<Cooler[]> {
    return this.coolerRepository.findAll();
  }

  getCoolerById(id: string): Promise<Cooler> {
    return this.coolerRepository.findById(id);
  }

  filterCooler(filter: CoolerFilter): Promise<Cooler[]> {
    return this.coolerRepository.filter(filter);
  }

  createCooler(input: CreateCoolerInput): Promise<Cooler> {
    return this.coolerRepository.create(input);
  }

  updateCooler(id: string, input: UpdateCoolerInput): Promise<Cooler> {
    return this.coolerRepository.update(id, input);
  }

  removeCooler(id: string): Promise<Cooler> {
    return this.coolerRepository.remove(id);
  }

  // ─── CASE ──────────────────────────────────────────────

  getAllCase(): Promise<Case[]> {
    return this.caseRepository.findAll();
  }

  getCaseById(id: string): Promise<Case> {
    return this.caseRepository.findById(id);
  }

  filterCase(filter: CaseFilter): Promise<Case[]> {
    return this.caseRepository.filter(filter);
  }

  createCase(input: CreateCaseInput): Promise<Case> {
    return this.caseRepository.create(input);
  }

  updateCase(id: string, input: UpdateCaseInput): Promise<Case> {
    return this.caseRepository.update(id, input);
  }

  removeCase(id: string): Promise<Case> {
    return this.caseRepository.remove(id);
  }

  // ─── SSD ───────────────────────────────────────────────

  getAllSsd(): Promise<Ssd[]> {
    return this.ssdRepository.findAll();
  }

  getSsdById(id: string): Promise<Ssd> {
    return this.ssdRepository.findById(id);
  }

  filterSsd(filter: SsdFilter): Promise<Ssd[]> {
    return this.ssdRepository.filter(filter);
  }

  createSsd(input: CreateSsdInput): Promise<Ssd> {
    return this.ssdRepository.create(input);
  }

  updateSsd(id: string, input: UpdateSsdInput): Promise<Ssd> {
    return this.ssdRepository.update(id, input);
  }

  removeSsd(id: string): Promise<Ssd> {
    return this.ssdRepository.remove(id);
  }
}
