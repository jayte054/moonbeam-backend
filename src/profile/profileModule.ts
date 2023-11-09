import { Module } from '@nestjs/common';
import { ProfileService } from './profileService/profileService';
import { ProfileController } from './ProfileController/profileController';
import { AuthModule } from 'src/authModule/authmodule';
import { CloudinaryModule } from 'src/cloudinary/cloudinaryModule';
import { ProfileRepository } from './profileReposiotry/profileRepository';
import { MailerModule } from 'src/mailerModule/mailerModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './profileEntity/profileEntity';

@Module({
  imports: [
    AuthModule,
    CloudinaryModule,
    MailerModule,
    TypeOrmModule.forFeature([ProfileEntity, ProfileRepository]),
  ],
  providers: [ProfileService, ProfileRepository, ProfileEntity],
  controllers: [ProfileController],
})
export class ProfileModule {}
