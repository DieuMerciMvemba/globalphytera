import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(role?: string) {
    const where: any = {};
    if (role) {
      where.role = role;
    }
    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        nom: true,
        role: true,
        isActive: true,
        createdAt: true,
        farms: {
          select: {
            id: true,
            name: true,
            location: true,
            fields: {
              select: {
                id: true,
                name: true,
                cultureType: true,
                devices: {
                  select: { id: true, status: true, serialNumber: true },
                },
              },
            },
          },
        },
        maintenanceTickets: {
          select: { id: true, status: true, title: true, interventionDate: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nom: true,
        role: true,
        isActive: true,
        preferences: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async updatePreferences(id: string, preferences: any) {
    return this.prisma.user.update({
      where: { id },
      data: { preferences },
      select: {
        id: true,
        email: true,
        nom: true,
        preferences: true,
      },
    });
  }
}
