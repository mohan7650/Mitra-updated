import { Module } from '@nestjs/common';
import { PetConnectionsController, PetConnectionsSubController } from './pet-connections.controller';
import { PetConnectionsService } from './pet-connections.service';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [PetConnectionsSubController, PetConnectionsController],
  providers: [PetConnectionsService],
})
export class PetConnectionsModule {}
