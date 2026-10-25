import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DroneService, CreateDroneMissionDto } from './drone.service';

@ApiTags('Drone & Imagerie Multispectrale')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(['api/v1/drone', 'api/v1/drone-missions'])
export class DroneController {
  constructor(private readonly droneService: DroneService) {}

  @Get('missions')
  @ApiOperation({ summary: "Lister toutes les missions de drone" })
  async getAllMissions() {
    return this.droneService.findAll();
  }

  @Get()
  @ApiOperation({ summary: "Lister toutes les missions de drone (alias)" })
  async getAllMissionsAlias() {
    return this.droneService.findAll();
  }

  @Post('missions')
  @ApiOperation({ summary: "Enregistrer un survol de drone et les cartographies (NDVI / Thermique)" })
  async createMission(@Body() dto: CreateDroneMissionDto) {
    return this.droneService.createMission(dto);
  }

  @Post()
  @ApiOperation({ summary: "Enregistrer un survol de drone (alias direct)" })
  async createMissionAlias(@Body() dto: CreateDroneMissionDto) {
    return this.droneService.createMission(dto);
  }

  @Get('field/:fieldId')
  @ApiOperation({ summary: "Consulter l'historique des missions de drone et cartes de végétation d'un champ" })
  async getMissionsByField(@Param('fieldId') fieldId: string) {
    return this.droneService.findByField(fieldId);
  }
}
