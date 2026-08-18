import { Module } from '@nestjs/common';
import { PetPhotosController, PhotosController } from './pet-photos.controller';
import { PetPhotosService } from './pet-photos.service';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [PetPhotosController, PhotosController],
  providers: [PetPhotosService],
})
export class PetPhotosModule {}
