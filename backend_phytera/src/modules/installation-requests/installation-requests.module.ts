import { Module } from '@nestjs/common';
import { InstallationRequestsController } from './installation-requests.controller';
import { InstallationRequestsService } from './installation-requests.service';
import { PrismaModule } from '../../database/prisma.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [PrismaModule, RealtimeModule],
  controllers: [InstallationRequestsController],
  providers: [InstallationRequestsService],
  exports: [InstallationRequestsService],
})
export class InstallationRequestsModule {}
