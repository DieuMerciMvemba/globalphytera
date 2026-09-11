import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateInstallationRequestDto {
  @ApiProperty({ example: 'UUID-DE-LA-FERME', description: 'ID de la ferme de l\'agriculteur' })
  @IsString()
  @IsNotEmpty()
  farmId: string;

  @ApiProperty({ example: 'Champ Tomates Nord', description: 'Nom de la parcelle' })
  @IsString()
  @IsNotEmpty()
  fieldName: string;

  @ApiProperty({ example: 'Tomate', description: 'Type de culture' })
  @IsString()
  @IsNotEmpty()
  cultureType: string;

  @ApiProperty({ example: 'Roma', required: false })
  @IsString()
  @IsOptional()
  variety?: string;

  @ApiProperty({ example: 1500, required: false, description: 'Superficie en m²' })
  @IsNumber()
  @IsOptional()
  surfaceArea?: number;

  @ApiProperty({ example: null, required: false, description: 'Polygone GPS GeoJSON' })
  @IsOptional()
  locationPolygon?: any;

  @ApiProperty({ example: 'SN-PHY-2026-X8F2A', required: false, description: 'Laisser vide pour génération automatique par le backend' })
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @ApiProperty({ example: 'ESP32_PHYTERA', default: 'ESP32_PHYTERA' })
  @IsString()
  @IsOptional()
  deviceType?: string;

  @ApiProperty({ example: '1.0.0', default: '1.0.0' })
  @IsString()
  @IsOptional()
  firmwareVersion?: string;
}
