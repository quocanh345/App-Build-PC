import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  CpuInput,
  RamInput,
  VgaInput,
  MainboardInput,
  PsuInput,
  CoolerInput,
  CaseInput,
  SsdInput,
} from './dto/product.input';
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
import { Cpu } from './entities/cpu.entity';
import { Ram } from './entities/ram.entity';
import { Vga } from './entities/vga.entity';
import { Mainboard } from './entities/mainboard.entity';
import { Psu } from './entities/psu.entity';
import { Cooler } from './entities/cooler.entity';
import { Case } from './entities/case.entity';
import { Ssd } from './entities/ssd.entity';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  // ─── CPU ───────────────────────────────────────────────

  @Query(() => [Cpu])
  async getAllCpu() {
    return this.productService.getAllCpu();
  }

  @Query(() => Cpu)
  async getCpuById(@Args('id') id: string) {
    return this.productService.getCpuById(id);
  }

  @Query(() => [Cpu])
  async filterCpu(@Args('filter') filter: CpuInput) {
    return this.productService.filterCpu(filter);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Cpu)
  async createCpu(@Args('input') input: CreateCpuInput) {
    return this.productService.createCpu(input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Cpu)
  async updateCpu(
    @Args('id') id: string,
    @Args('input') input: UpdateCpuInput,
  ) {
    return this.productService.updateCpu(id, input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Cpu)
  async removeCpu(@Args('id') id: string) {
    return this.productService.removeCpu(id);
  }

  // ─── RAM ───────────────────────────────────────────────

  @Query(() => [Ram])
  async getAllRam() {
    return this.productService.getAllRam();
  }

  @Query(() => Ram)
  async getRamById(@Args('id') id: string) {
    return this.productService.getRamById(id);
  }

  @Query(() => [Ram])
  async filterRam(@Args('filter') filter: RamInput) {
    return this.productService.filterRam(filter);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Ram)
  async createRam(@Args('input') input: CreateRamInput) {
    return this.productService.createRam(input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Ram)
  async updateRam(
    @Args('id') id: string,
    @Args('input') input: UpdateRamInput,
  ) {
    return this.productService.updateRam(id, input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Ram)
  async removeRam(@Args('id') id: string) {
    return this.productService.removeRam(id);
  }

  // ─── VGA ───────────────────────────────────────────────

  @Query(() => [Vga])
  async getAllVga() {
    return this.productService.getAllVga();
  }

  @Query(() => Vga)
  async getVgaById(@Args('id') id: string) {
    return this.productService.getVgaById(id);
  }

  @Query(() => [Vga])
  async filterVga(@Args('filter') filter: VgaInput) {
    return this.productService.filterVga(filter);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Vga)
  async createVga(@Args('input') input: CreateVgaInput) {
    return this.productService.createVga(input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Vga)
  async updateVga(
    @Args('id') id: string,
    @Args('input') input: UpdateVgaInput,
  ) {
    return this.productService.updateVga(id, input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Vga)
  async removeVga(@Args('id') id: string) {
    return this.productService.removeVga(id);
  }

  // ─── MAINBOARD ─────────────────────────────────────────

  @Query(() => [Mainboard])
  async getAllMainboard() {
    return this.productService.getAllMainboard();
  }

  @Query(() => Mainboard)
  async getMainboardById(@Args('id') id: string) {
    return this.productService.getMainboardById(id);
  }

  @Query(() => [Mainboard])
  async filterMainboard(@Args('filter') filter: MainboardInput) {
    return this.productService.filterMainboard(filter);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Mainboard)
  async createMainboard(@Args('input') input: CreateMainboardInput) {
    return this.productService.createMainboard(input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Mainboard)
  async updateMainboard(
    @Args('id') id: string,
    @Args('input') input: UpdateMainboardInput,
  ) {
    return this.productService.updateMainboard(id, input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Mainboard)
  async removeMainboard(@Args('id') id: string) {
    return this.productService.removeMainboard(id);
  }

  // ─── PSU ───────────────────────────────────────────────

  @Query(() => [Psu])
  async getAllPsu() {
    return this.productService.getAllPsu();
  }

  @Query(() => Psu)
  async getPsuById(@Args('id') id: string) {
    return this.productService.getPsuById(id);
  }

  @Query(() => [Psu])
  async filterPsu(@Args('filter') filter: PsuInput) {
    return this.productService.filterPsu(filter);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Psu)
  async createPsu(@Args('input') input: CreatePsuInput) {
    return this.productService.createPsu(input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Psu)
  async updatePsu(
    @Args('id') id: string,
    @Args('input') input: UpdatePsuInput,
  ) {
    return this.productService.updatePsu(id, input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Psu)
  async removePsu(@Args('id') id: string) {
    return this.productService.removePsu(id);
  }

  // ─── COOLER ────────────────────────────────────────────

  @Query(() => [Cooler])
  async getAllCooler() {
    return this.productService.getAllCooler();
  }

  @Query(() => Cooler)
  async getCoolerById(@Args('id') id: string) {
    return this.productService.getCoolerById(id);
  }

  @Query(() => [Cooler])
  async filterCooler(@Args('filter') filter: CoolerInput) {
    return this.productService.filterCooler(filter);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Cooler)
  async createCooler(@Args('input') input: CreateCoolerInput) {
    return this.productService.createCooler(input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Cooler)
  async updateCooler(
    @Args('id') id: string,
    @Args('input') input: UpdateCoolerInput,
  ) {
    return this.productService.updateCooler(id, input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Cooler)
  async removeCooler(@Args('id') id: string) {
    return this.productService.removeCooler(id);
  }

  // ─── CASE ──────────────────────────────────────────────

  @Query(() => [Case])
  async getAllCase() {
    return this.productService.getAllCase();
  }

  @Query(() => Case)
  async getCaseById(@Args('id') id: string) {
    return this.productService.getCaseById(id);
  }

  @Query(() => [Case])
  async filterCase(@Args('filter') filter: CaseInput) {
    return this.productService.filterCase(filter);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Case)
  async createCase(@Args('input') input: CreateCaseInput) {
    return this.productService.createCase(input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Case)
  async updateCase(
    @Args('id') id: string,
    @Args('input') input: UpdateCaseInput,
  ) {
    return this.productService.updateCase(id, input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Case)
  async removeCase(@Args('id') id: string) {
    return this.productService.removeCase(id);
  }

  // ─── SSD ───────────────────────────────────────────────

  @Query(() => [Ssd])
  async getAllSsd() {
    return this.productService.getAllSsd();
  }

  @Query(() => Ssd)
  async getSsdById(@Args('id') id: string) {
    return this.productService.getSsdById(id);
  }

  @Query(() => [Ssd])
  async filterSsd(@Args('filter') filter: SsdInput) {
    return this.productService.filterSsd(filter);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Ssd)
  async createSsd(@Args('input') input: CreateSsdInput) {
    return this.productService.createSsd(input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Ssd)
  async updateSsd(
    @Args('id') id: string,
    @Args('input') input: UpdateSsdInput,
  ) {
    return this.productService.updateSsd(id, input);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Ssd)
  async removeSsd(@Args('id') id: string) {
    return this.productService.removeSsd(id);
  }
}
