import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { CreateInstallationRequestDto } from './dto/create-installation-request.dto';
import { RejectInstallationRequestDto } from './dto/reject-installation-request.dto';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class InstallationRequestsService {
  private readonly logger = new Logger(InstallationRequestsService.name);

  constructor(
    private prisma: PrismaService,
    private realtimeGateway: RealtimeGateway,
  ) {}

  /**
   * Génère un numéro de série unique pour le boîtier ESP32
   * Exemple: SN-PHY-2026-A8F3C9
   */
  private generateSerialNumber(): string {
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `SN-PHY-${year}-${randomHex}`;
  }

  async createRequest(technicianId: string, role: string, dto: CreateInstallationRequestDto) {
    if (role !== 'TECHNICIEN' && role !== 'ADMIN') {
      throw new ForbiddenException('Seuls les techniciens et administrateurs peuvent initier une demande d\'installation');
    }

    const farm = await this.prisma.farm.findUnique({
      where: { id: dto.farmId },
      include: { owner: true },
    });

    if (!farm) {
      throw new NotFoundException('Exploitation agricole introuvable');
    }

    // Générer automatiquement le numéro de série s'il n'est pas fourni
    let serialNumber = dto.serialNumber;
    if (!serialNumber || serialNumber.trim() === '') {
      serialNumber = this.generateSerialNumber();
    }

    // Vérifier l'unicité du numéro de série dans les boîtiers existants et les demandes en attente
    const existingDevice = await this.prisma.device.findUnique({
      where: { serialNumber },
    });
    if (existingDevice) {
      throw new BadRequestException(`Le numéro de série ${serialNumber} est déjà attribué à un autre boîtier`);
    }

    const request = await this.prisma.installationRequest.create({
      data: {
        technicianId,
        farmId: dto.farmId,
        fieldName: dto.fieldName,
        cultureType: dto.cultureType,
        variety: dto.variety,
        surfaceArea: dto.surfaceArea,
        locationPolygon: dto.locationPolygon,
        serialNumber,
        deviceType: dto.deviceType || 'ESP32_PHYTERA',
        firmwareVersion: dto.firmwareVersion || '1.0.0',
        status: 'PENDING',
      },
      include: {
        farm: {
          include: {
            owner: true,
          },
        },
        technician: true,
      },
    });

    // Créer une notification pour l'agriculteur
    await this.prisma.notification.create({
      data: {
        userId: farm.ownerId,
        title: 'Nouvelle proposition d\'installation',
        body: `Le technicien ${request.technician.nom} vous propose la création du champ "${dto.fieldName}" avec le boîtier ${serialNumber}.`,
        type: 'WEBSOCKET',
        priority: 'HIGH',
      },
    });

    // Notification temps réel via WebSockets
    this.realtimeGateway.emitNotificationToUser(farm.ownerId, {
      type: 'INSTALLATION_REQUEST_CREATED',
      requestId: request.id,
      fieldName: dto.fieldName,
      serialNumber,
    });

    return request;
  }

  async getMyRequests(technicianId: string) {
    return this.prisma.installationRequest.findMany({
      where: { technicianId },
      include: {
        farm: {
          include: { owner: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPendingRequestsForUser(userId: string) {
    return this.prisma.installationRequest.findMany({
      where: {
        farm: {
          ownerId: userId,
        },
        status: 'PENDING',
      },
      include: {
        farm: true,
        technician: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRequestsForFarm(farmId: string, userId: string, role: string) {
    const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
    if (!farm) throw new NotFoundException('Exploitation introuvable');

    if (role !== 'ADMIN' && role !== 'TECHNICIEN' && farm.ownerId !== userId) {
      throw new ForbiddenException('Accès non autorisé à cette exploitation');
    }

    return this.prisma.installationRequest.findMany({
      where: { farmId },
      include: { technician: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async acceptRequest(requestId: string, userId: string, role: string) {
    const request = await this.prisma.installationRequest.findUnique({
      where: { id: requestId },
      include: { farm: true, technician: true },
    });

    if (!request) {
      throw new NotFoundException('Demande d\'installation introuvable');
    }

    if (role !== 'ADMIN' && request.farm.ownerId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas le propriétaire de l\'exploitation associée');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException(`Cette demande est déjà ${request.status.toLowerCase()}`);
    }

    // Clé d'API du boîtier auto-générée
    const deviceKey = `PHYTERA_${crypto.randomBytes(12).toString('hex').toUpperCase()}`;

    // Transaction atomique : Création Champ + Création Boîtier + Update Demande
    const result = await this.prisma.$transaction(async (tx) => {
      const field = await tx.field.create({
        data: {
          name: request.fieldName,
          farmId: request.farmId,
          cultureType: request.cultureType,
          variety: request.variety,
          surfaceArea: request.surfaceArea,
          locationPolygon: request.locationPolygon as any,
        },
      });

      const device = await tx.device.create({
        data: {
          deviceKey,
          serialNumber: request.serialNumber,
          fieldId: field.id,
          deviceType: request.deviceType,
          firmwareVersion: request.firmwareVersion,
          status: 'ACTIVE',
        },
      });

      const updatedRequest = await tx.installationRequest.update({
        where: { id: requestId },
        data: {
          status: 'ACCEPTED',
          createdFieldId: field.id,
          createdDeviceId: device.id,
        },
      });

      return { field, device, updatedRequest };
    });

    // Notifier le technicien de l'acceptation
    await this.prisma.notification.create({
      data: {
        userId: request.technicianId,
        title: 'Proposition d\'installation acceptée',
        body: `L'agriculteur a accepté la création du champ "${request.fieldName}" (#${request.serialNumber}).`,
        type: 'WEBSOCKET',
        priority: 'MEDIUM',
      },
    });

    this.realtimeGateway.emitNotificationToUser(request.technicianId, {
      type: 'INSTALLATION_REQUEST_ACCEPTED',
      requestId: request.id,
      fieldId: result.field.id,
      deviceId: result.device.id,
    });

    return result;
  }

  async rejectRequest(requestId: string, userId: string, role: string, dto: RejectInstallationRequestDto) {
    const request = await this.prisma.installationRequest.findUnique({
      where: { id: requestId },
      include: { farm: true, technician: true },
    });

    if (!request) {
      throw new NotFoundException('Demande d\'installation introuvable');
    }

    if (role !== 'ADMIN' && request.farm.ownerId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas le propriétaire de l\'exploitation associée');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException(`Cette demande est déjà ${request.status.toLowerCase()}`);
    }

    const updated = await this.prisma.installationRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        rejectionReason: dto?.rejectionReason || 'Refusé par l\'agriculteur',
      },
    });

    // Notifier le technicien
    await this.prisma.notification.create({
      data: {
        userId: request.technicianId,
        title: 'Proposition d\'installation refusée',
        body: `L'agriculteur a refusé la proposition pour "${request.fieldName}". Motifs: ${dto?.rejectionReason || 'Non précisé'}.`,
        type: 'WEBSOCKET',
        priority: 'MEDIUM',
      },
    });

    return updated;
  }
}
