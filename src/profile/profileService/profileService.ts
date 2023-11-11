import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { CreateProfileDto, UpdateProfileDto } from '../profileDto/profileDto';
import { ProfileEntity } from '../profileEntity/profileEntity';
import { ProfileRepository } from '../profileReposiotry/profileRepository';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileRepository)
    private profileRepository: ProfileRepository,
  ) {}

  createProfile = async (
    user: AuthEntity,
    createProfileDto: CreateProfileDto,
    req: Request,
  ): Promise<ProfileEntity | any> => {
    return await this.profileRepository.createProfile(
      user,
      createProfileDto,
      req,
    );
  };

  getProfileWithId = async (
    profileId: string,
    user: AuthEntity,
  ): Promise<ProfileEntity | any> => {
    return await this.profileRepository.getProfileWithId(profileId, user);
  };

  updateProfile = async (
    profileId: string,
    updateProfileDto: UpdateProfileDto,
    user: AuthEntity,
    req?: Request,
  ): Promise<ProfileEntity | any> => {
    return await this.profileRepository.updateProfile(
      profileId,
      user,
      updateProfileDto,
      req,
    );
  };
}
