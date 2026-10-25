import { PrismaClient, Role, DeviceStatus, AlertType, AlertLevel, TicketStatus, RequestStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du peuplement de la base de données Supabase PhyTera...');

  const passwordHash = await bcrypt.hash('Phytera2026!', 10);

  // 1. Création des Utilisateurs
  const admin = await prisma.user.upsert({
    where: { email: 'admin@phytera.com' },
    update: {},
    create: {
      email: 'admin@phytera.com',
      password: passwordHash,
      nom: 'Alexandre Morel (Admin)',
      role: Role.ADMIN,
      isActive: true,
      preferences: { theme: 'dark', notifications: true },
    },
  });

  const tech = await prisma.user.upsert({
    where: { email: 'technicien@phytera.com' },
    update: {},
    create: {
      email: 'technicien@phytera.com',
      password: passwordHash,
      nom: 'Pierre Martin (Technicien)',
      role: Role.TECHNICIEN,
      isActive: true,
      preferences: { sector: 'Nouvelle-Aquitaine', phone: '+33 6 12 34 56 78' },
    },
  });

  const farmer = await prisma.user.upsert({
    where: { email: 'agriculteur@phytera.com' },
    update: {},
    create: {
      email: 'agriculteur@phytera.com',
      password: passwordHash,
      nom: 'Jean Dupont (Agriculteur)',
      role: Role.AGRICULTEUR,
      isActive: true,
      preferences: { smsAlerts: true },
    },
  });

  console.log('✅ Utilisateurs créés ou mis à jour :');
  console.log(`   - Admin: admin@phytera.com / Phytera2026!`);
  console.log(`   - Technicien: technicien@phytera.com / Phytera2026!`);
  console.log(`   - Agriculteur: agriculteur@phytera.com / Phytera2026!`);

  // 2. Abonnements
  await prisma.subscription.upsert({
    where: { id: 'sub-farmer-1' },
    update: {},
    create: {
      id: 'sub-farmer-1',
      userId: farmer.id,
      plan: 'PREMIUM',
      limits: { maxFarms: 5, maxFields: 20, maxDevicesPerField: 5 },
      active: true,
    },
  });

  // 3. Exploitation Agricole (Farm)
  let farm = await prisma.farm.findFirst({ where: { ownerId: farmer.id } });
  if (!farm) {
    farm = await prisma.farm.create({
      data: {
        name: 'Domaine de la Vallée Verte',
        description: 'Exploitation céréalière et maraîchère éco-responsable',
        location: 'Bordeaux, France',
        ownerId: farmer.id,
      },
    });
  }

  // 4. Parcelles (Fields)
  let field1 = await prisma.field.findFirst({ where: { farmId: farm.id, name: 'Parcelle Blé #12' } });
  if (!field1) {
    field1 = await prisma.field.create({
      data: {
        name: 'Parcelle Blé #12',
        description: 'Blé dur d\'hiver sur sol argilo-calcaire',
        farmId: farm.id,
        cultureType: 'Blé',
        variety: 'Apache',
        surfaceArea: 45000, // 4.5 hectares
      },
    });
  }

  let field2 = await prisma.field.findFirst({ where: { farmId: farm.id, name: 'Serre Tomates B' } });
  if (!field2) {
    field2 = await prisma.field.create({
      data: {
        name: 'Serre Tomates B',
        description: 'Serre connectée et ventilée',
        farmId: farm.id,
        cultureType: 'Tomate',
        variety: 'Cœur de Bœuf',
        surfaceArea: 2500,
      },
    });
  }

  // 5. Boîtiers IoT (Devices)
  const deviceKey1 = 'PHYTERA_A1B2C3D4E5F6789012345678';
  let device1 = await prisma.device.findUnique({ where: { serialNumber: 'SN-PHY-2026-X8F2A' } });
  if (!device1) {
    device1 = await prisma.device.create({
      data: {
        serialNumber: 'SN-PHY-2026-X8F2A',
        deviceKey: deviceKey1,
        fieldId: field1.id,
        deviceType: 'ESP32_PHYTERA',
        firmwareVersion: '1.0.0',
        status: DeviceStatus.ACTIVE,
        lastSeen: new Date(),
      },
    });
  }

  let device2 = await prisma.device.findUnique({ where: { serialNumber: 'SN-PHY-2026-M4B9C' } });
  if (!device2) {
    device2 = await prisma.device.create({
      data: {
        serialNumber: 'SN-PHY-2026-M4B9C',
        deviceKey: 'PHYTERA_B2C3D4E5F67890123456789A',
        fieldId: field2.id,
        deviceType: 'ESP32_PHYTERA',
        firmwareVersion: '1.0.0',
        status: DeviceStatus.ACTIVE,
        lastSeen: new Date(),
      },
    });
  }

  // 6. Données Télémétriques (SensorData)
  const now = Date.now();
  for (let i = 0; i < 10; i++) {
    const timestamp = new Date(now - (9 - i) * 15 * 60 * 1000); // toutes les 15 minutes
    const clientUuid = `seed-telemetry-${device1.id}-${i}`;
    await prisma.sensorData.upsert({
      where: { clientUuid },
      update: {},
      create: {
        clientUuid,
        deviceId: device1.id,
        fieldId: field1.id,
        timestamp,
        tempAir: 22.4 + (Math.sin(i) * 2),
        humAir: 68.5 + (Math.cos(i) * 5),
        tempSol: 19.1 + (Math.sin(i) * 0.5),
        humSol: 42.0 - (i * 0.8), // Stress hydrique descendant
        phSol: 6.8,
        ecSol: 1.45,
        luminosite: 45000 + i * 1200,
      },
    });
  }

  // 7. Alertes Réelles
  let alert1 = await prisma.alert.findFirst({ where: { fieldId: field1.id, type: AlertType.HYDRIC_STRESS } });
  if (!alert1) {
    await prisma.alert.create({
      data: {
        fieldId: field1.id,
        deviceId: device1.id,
        type: AlertType.HYDRIC_STRESS,
        level: AlertLevel.WARNING,
        title: 'Stress hydrique modéré détecté',
        message: 'L\'humidité du sol sur la Parcelle Blé #12 est descendue à 34%. Déclenchement de l\'irrigation recommandé.',
        resolved: false,
      },
    });
  }

  // 8. Tickets de Maintenance Réels
  let ticket1 = await prisma.maintenanceTicket.findFirst({ where: { deviceId: device1.id } });
  if (!ticket1) {
    await prisma.maintenanceTicket.create({
      data: {
        deviceId: device1.id,
        technicianId: tech.id,
        status: TicketStatus.IN_PROGRESS,
        title: 'Calibrage de sonde sol SDI-12',
        issueDescription: 'Vérification de la précision des relevés de conductivité électrique et d\'humidité sol.',
        interventionDate: new Date(),
      },
    });
  }

  // 9. Demande d'installation (InstallationRequest)
  let request1 = await prisma.installationRequest.findFirst({ where: { farmId: farm.id, serialNumber: 'SN-PHY-2026-NEW01' } });
  if (!request1) {
    await prisma.installationRequest.create({
      data: {
        technicianId: tech.id,
        farmId: farm.id,
        fieldName: 'Parcelle Verger Sud',
        cultureType: 'Pommier',
        variety: 'Gala',
        surfaceArea: 12000,
        serialNumber: 'SN-PHY-2026-NEW01',
        deviceType: 'ESP32_PHYTERA',
        firmwareVersion: '1.0.0',
        status: RequestStatus.PENDING,
      },
    });
  }

  console.log('🎉 Base de données Supabase peuplée avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
