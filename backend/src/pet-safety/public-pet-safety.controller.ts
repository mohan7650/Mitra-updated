import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PetSafetyService } from './pet-safety.service';

// Intentionally has no JwtAuthGuard: someone who finds a lost pet and scans its
// QR code will not have a Mitra account or session.
@Controller('public/pets/qr')
export class PublicPetSafetyController {
  constructor(private readonly service: PetSafetyService) {}

  @Get(':qrCodeId')
  async findByQrCode(@Param('qrCodeId') qrCodeId: string) {
    const result = await this.service.findByQrCode(qrCodeId);
    if (!result) throw new NotFoundException('Pet ID not found');
    return result;
  }
}
