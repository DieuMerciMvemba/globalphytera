import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Role } from '@prisma/client';
import { InstallationRequestsService } from './installation-requests.service';
import { CreateInstallationRequestDto } from './dto/create-installation-request.dto';
import { RejectInstallationRequestDto } from './dto/reject-installation-request.dto';

@ApiTags('Installation Requests & Onboarding IoT')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/installation-requests')
export class InstallationRequestsController {
  constructor(private readonly installationRequestsService: InstallationRequestsService) {}

  @Post()
  @Roles(Role.TECHNICIEN, Role.ADMIN)
  @ApiOperation({ summary: 'Proposer l\'installation d\'un champ et boîtier pour un client (Technicien)' })
  create(
    @GetUser('id') technicianId: string,
    @GetUser('role') role: string,
    @Body() dto: CreateInstallationRequestDto,
  ) {
    return this.installationRequestsService.createRequest(technicianId, role, dto);
  }

  @Get('my-requests')
  @Roles(Role.TECHNICIEN, Role.ADMIN)
  @ApiOperation({ summary: 'Consulter les propositions d\'installation créées par le technicien connecté' })
  getMyRequests(@GetUser('id') technicianId: string) {
    return this.installationRequestsService.getMyRequests(technicianId);
  }

  @Get('pending')
  @Roles(Role.AGRICULTEUR, Role.ADMIN)
  @ApiOperation({ summary: 'Consulter les propositions d\'installation en attente de ma ferme (Agriculteur)' })
  getPendingForUser(@GetUser('id') userId: string) {
    return this.installationRequestsService.getPendingRequestsForUser(userId);
  }

  @Get('farm/:farmId')
  @ApiOperation({ summary: 'Consulter les demandes d\'installation d\'une exploitation' })
  getRequestsForFarm(
    @Param('farmId') farmId: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
  ) {
    return this.installationRequestsService.getRequestsForFarm(farmId, userId, role);
  }

  @Post(':id/accept')
  @Roles(Role.AGRICULTEUR, Role.ADMIN)
  @ApiOperation({ summary: 'Accepter la proposition d\'installation : Crée le Champ et active le Boîtier (Agriculteur)' })
  accept(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
  ) {
    return this.installationRequestsService.acceptRequest(id, userId, role);
  }

  @Post(':id/reject')
  @Roles(Role.AGRICULTEUR, Role.ADMIN)
  @ApiOperation({ summary: 'Refuser la proposition d\'installation (Agriculteur)' })
  reject(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
    @Body() dto: RejectInstallationRequestDto,
  ) {
    return this.installationRequestsService.rejectRequest(id, userId, role, dto);
  }
}
