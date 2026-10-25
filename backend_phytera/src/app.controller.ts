import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Root & Health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Vérification de statut du backend central PhyTera' })
  getRoot() {
    return {
      status: 'online',
      name: 'PhyTera Central API',
      message: 'PhyTera Backend NestJS & PostgreSQL Supabase is running on Vercel',
      version: '1.0.0',
      documentation: '/api/docs',
      endpointsPrefix: '/api/v1',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Healthcheck endpoint' })
  getHealth() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
