import { NotFoundException } from '@nestjs/common';
import { ProfileEntity } from 'src/profile/profileEntity/profileEntity';
import { FindOneOptions } from 'typeorm';

export const fetchProfiles = async () => {
  const options: FindOneOptions<ProfileEntity> = {};

  const profiles: any = await ProfileEntity.find(options);

  if (profiles.length === 0) {
    throw new NotFoundException('profiles not found');
  }

  const userProfiles = profiles.map((profile) => ({
    firstname: profile.firstname,
    lastname: profile.lastname,
    phoneNumber: profile.phoneNumber,
    address: profile.address,
    dateOfBirth: profile.dateOfBirth,
    imageUrl: profile.imageUrl,
  }));
  return userProfiles;
};
