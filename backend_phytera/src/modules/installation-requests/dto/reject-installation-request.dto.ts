import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RejectInstallationRequestDto {
  @ApiProperty({ example: 'Superficie incorrecte ou refus d\'installation', required: false })
  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
