import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Role } from '@prisma/client';
import { MaintenanceService, CreateTicketDto, UpdateTicketDto } from './maintenance.service';

@ApiTags('Maintenance & Techniciens')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  @Roles(Role.TECHNICIEN, Role.ADMIN)
  @ApiOperation({ summary: "Consulter les tickets d'intervention (tous pour Admin, assignés pour Technicien)" })
  async getInterventions(@GetUser('id') userId: string, @GetUser('role') role: Role) {
    if (role === Role.ADMIN) {
      return this.maintenanceService.findAll();
    }
    return this.maintenanceService.findForTechnician(userId);
  }

  @Post()
  @Roles(Role.TECHNICIEN, Role.ADMIN)
  @ApiOperation({ summary: "Créer un ticket d'intervention (alias)" })
  async createInterventionRoot(@GetUser('id') technicianId: string, @Body() dto: Omit<CreateTicketDto, 'technicianId'>) {
    return this.maintenanceService.create({ ...dto, technicianId });
  }

  @Post('tickets')
  @Roles(Role.TECHNICIEN, Role.ADMIN)
  @ApiOperation({ summary: "Ouvrir un ticket d'intervention technique sur un boîtier" })
  async createTicket(@GetUser('id') technicianId: string, @Body() dto: Omit<CreateTicketDto, 'technicianId'>) {
    return this.maintenanceService.create({ ...dto, technicianId });
  }

  @Patch('tickets/:id')
  @Roles(Role.TECHNICIEN, Role.ADMIN)
  @ApiOperation({ summary: "Mettre à jour le statut et la note de résolution d'un ticket de maintenance" })
  async updateTicket(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.maintenanceService.update(id, dto);
  }

  @Get('my-interventions')
  @Roles(Role.TECHNICIEN, Role.ADMIN)
  @ApiOperation({ summary: "Consulter les tickets d'intervention assignés au technicien connecté" })
  async getMyInterventions(@GetUser('id') technicianId: string) {
    return this.maintenanceService.findForTechnician(technicianId);
  }

  @Get('device/:deviceId')
  @Roles(Role.AGRICULTEUR, Role.TECHNICIEN, Role.ADMIN)
  @ApiOperation({ summary: "Historique des maintenances pour un boîtier donné" })
  async getDeviceTickets(@Param('deviceId') deviceId: string) {
    return this.maintenanceService.findForDevice(deviceId);
  }

  @Get('tickets/:id')
  @Roles(Role.TECHNICIEN, Role.ADMIN)
  @ApiOperation({ summary: "Obtenir les détails d'un ticket d'intervention" })
  async getTicketById(@Param('id') id: string) {
    return this.maintenanceService.findOne(id);
  }

  @Get('tickets')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Lister tous les tickets d'intervention (Admin)" })
  async getAllTickets() {
    return this.maintenanceService.findAll();
  }
}
