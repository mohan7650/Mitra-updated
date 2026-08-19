import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PetsModule } from './pets/pets.module';
import { VaccinationsModule } from './vaccinations/vaccinations.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { MedicationsModule } from './medications/medications.module';
import { AllergiesModule } from './allergies/allergies.module';
import { WeightRecordsModule } from './weight-records/weight-records.module';
import { GroomingRecordsModule } from './grooming-records/grooming-records.module';
import { PetPhotosModule } from './pet-photos/pet-photos.module';
import { PetSafetyModule } from './pet-safety/pet-safety.module';
import { RemindersModule } from './reminders/reminders.module';
import { EmergencyContactsModule } from './emergency-contacts/emergency-contacts.module';
import { VetClinicsModule } from './vet-clinics/vet-clinics.module';
import { PetPostsModule } from './pet-posts/pet-posts.module';
import { PetConnectionsModule } from './pet-connections/pet-connections.module';
import { CommunityModule } from './community/community.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PetsModule,
    VaccinationsModule,
    MedicalRecordsModule,
    MedicationsModule,
    AllergiesModule,
    WeightRecordsModule,
    GroomingRecordsModule,
    PetPhotosModule,
    PetSafetyModule,
    RemindersModule,
    EmergencyContactsModule,
    VetClinicsModule,
    PetPostsModule,
    PetConnectionsModule,
    CommunityModule,
  ],
})
export class AppModule {}
