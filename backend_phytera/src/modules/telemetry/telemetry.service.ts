import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TelemetryBatchDto } from './dto/telemetry-batch.dto';
import { RuleEngineService } from '../rule-engine/rule-engine.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { DevicesService } from '../devices/devices.service';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  constructor(
    private prisma: PrismaService,
    private ruleEngineService: RuleEngineService,
    private realtimeGateway: RealtimeGateway,
    private devicesService: DevicesService,
  ) {}

  /**
   * Assainit une valeur de capteur : Rejette les NaN, valeurs nulles/indéfinies ou aberrantes
   */
  private sanitizeValue(val: any, minBound: number, maxBound: number): number | null {
    if (val === null || val === undefined || typeof val !== 'number' || isNaN(val)) {
      return null;
    }
    if (val < minBound || val > maxBound) {
      this.logger.warn(`Valeur de capteur aberrante ignorée (${val}) [Attendu: ${minBound} à ${maxBound}]`);
      return null;
    }
    return Number(val.toFixed(2));
  }

  async processBatch(device: any, dto: TelemetryBatchDto) {
    const accepted: string[] = [];
    const rejected: string[] = [];

    const fieldId = device.fieldId;
    const userId = device.field.farm.ownerId;

    for (const measurement of dto.measurements) {
      try {
        // Protection contre les doublons via clientUuid (idempotence hors-ligne)
        const existing = await this.prisma.sensorData.findUnique({
          where: { clientUuid: measurement.clientUuid },
        });

        if (existing) {
          this.logger.debug(`Mesure ignorée (déjà ingérée): ${measurement.clientUuid}`);
          accepted.push(measurement.clientUuid); // Déjà accepté
          continue;
        }

        // Assainissement des capteurs avec tolérance aux pannes
        const tempAir = this.sanitizeValue(measurement.tempAir, -40, 80);
        const humAir = this.sanitizeValue(measurement.humAir, 0, 100);
        const tempSol = this.sanitizeValue(measurement.tempSol, -20, 70);
        const humSol = this.sanitizeValue(measurement.humSol, 0, 100);
        const phSol = this.sanitizeValue(measurement.phSol, 0, 14);
        const ecSol = this.sanitizeValue(measurement.ecSol, 0, 30);
        const luminosite = this.sanitizeValue(measurement.luminosite, 0, 250000);

        const created = await this.prisma.sensorData.create({
          data: {
            clientUuid: measurement.clientUuid,
            deviceId: device.id,
            fieldId: fieldId,
            timestamp: new Date(measurement.timestamp),
            tempAir,
            humAir,
            tempSol,
            humSol,
            phSol,
            ecSol,
            luminosite,
            rawPayload: measurement as any,
          },
        });

        accepted.push(measurement.clientUuid);

        // Évaluation agronomique résiliente en arrière-plan (même avec capteurs absents/nulls)
        await this.ruleEngineService.evaluate({
          fieldId,
          deviceId: device.id,
          userId,
          tempAir,
          humAir,
          tempSol,
          humSol,
          phSol,
          luminosite,
        });

        // Diffusion temps réel sur les canaux WebSockets
        this.realtimeGateway.emitNewMeasure(fieldId, device.id, userId, created);
      } catch (error) {
        this.logger.error(`Erreur d'ingestion pour clientUuid ${measurement.clientUuid}: ${error.message}`);
        rejected.push(measurement.clientUuid);
      }
    }

    // Mettre à jour lastSeen sur le boîtier
    await this.devicesService.updateLastSeen(device.id);

    return {
      status: 'ok',
      accepted,
      rejected,
      serverTime: new Date().toISOString(),
    };
  }

  async getTelemetryForField(fieldId: string, limit = 100) {
    return this.prisma.sensorData.findMany({
      where: { fieldId },
      orderBy: { timestamp: 'desc' },
      take: Number(limit),
    });
  }

  async getLatestTelemetryForField(fieldId: string) {
    return this.prisma.sensorData.findFirst({
      where: { fieldId },
      orderBy: { timestamp: 'desc' },
    });
  }
}
