import { Module } from '@nestjs/common';
import { PetPostsController, PetPostsSubController } from './pet-posts.controller';
import { PetPostsService } from './pet-posts.service';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [PetPostsSubController, PetPostsController],
  providers: [PetPostsService],
})
export class PetPostsModule {}
