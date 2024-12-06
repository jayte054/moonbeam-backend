import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { profile } from 'console';
import { Request } from 'express';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { CloudinaryService } from 'src/cloudinary/cloudinaryService/cloudinaryService';
import { DataSource, Repository } from 'typeorm';
import { CreateProfileDto, UpdateProfileDto } from '../profileDto/profileDto';
import { ProfileEntity } from '../profileEntity/profileEntity';

@Injectable()
export class ProfileRepository extends Repository<ProfileEntity> {
  private logger = new Logger('ProfileRepository');
  constructor(
    private dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
  ) {
    super(ProfileEntity, dataSource.createEntityManager());
  }

  //======== Profile ========//
  createProfile = async (
    user: AuthEntity,
    createProfileDto: CreateProfileDto,
    req: Request,
  ): Promise<ProfileEntity | any> => {
    const { address, dateOfBirth } = createProfileDto;
    const cloudinaryUrl = await this.cloudinaryService.uploadImage(req.file);
    const profile = new ProfileEntity();

    profile.user = user;
    profile.firstname = user.firstname;
    profile.lastname = user.lastname;
    profile.address = address;
    profile.phoneNumber = user.phoneNumber;
    profile.dateOfBirth = dateOfBirth.toLocaleString();
    profile.imageUrl = cloudinaryUrl.secure_url;
    profile.userId = user.id;

    try {
      await profile.save();
      this.logger.verbose(`profile for user ${user.id} successfully saved`);
    } catch (error) {
      console.log(error);
      this.logger.error(`error saving ${user.id} profile`);
      throw new InternalServerErrorException(`error saving ${user.id} profile`);
    }

    return {
      id: profile.profileId,
      firstname: profile.firstname,
      lastname: profile.lastname,
      address: profile.address,
      phoneNumber: profile.phoneNumber,
      dateOfBirth: profile.dateOfBirth,
      imageUrl: profile.imageUrl,
    };
  };

  getProfile = async (user: AuthEntity): Promise<ProfileEntity | any> => {
    const query = this.createQueryBuilder('profile');
    query.where('profile.firstname = :firstname', {
      firstname: user.firstname,
    });

    try {
      const profile = await this.findOne({
        where: {
          firstname: user.firstname,
        },
      });
      if (!profile) {
        throw new NotFoundException(
          `profile with name ${user.firstname} not found`,
        );
      }
      this.logger.verbose(
        `profile with name ${user.firstname} fetched successfully ${{
          profile,
        }}`,
      );
      console.log(profile);
      return profile;
    } catch (error) {
      this.logger.error(`profile with name ${user.firstname} not found`);
      throw new NotFoundException(
        `profile with name ${user.firstname} not found`,
      );
    }
  };

  updateProfile = async (
    profileId: string,
    user: AuthEntity,
    updateProfileDto: UpdateProfileDto,
    req?: Request,
  ): Promise<ProfileEntity | any> => {
    const { firstname, lastname, dateOfBirth, phoneNumber, address, file } =
      updateProfileDto;

    const profile = await this.getProfile(user);
    console.log(profile);
    if (file) {
      const newImage = await this.cloudinaryService.uploadImage(req.file);

      if (profile.imageUrl) {
        const oldPublicId = this.extractPublicId(profile.imageUrl);
        await this.cloudinaryService.deleteImage(oldPublicId);
      }
      profile.imageUrl = newImage.secure_url;
    }

    profile.firstname = firstname;
    profile.lastname = lastname;
    profile.dateOfBirth = dateOfBirth;
    profile.phoneNumber = phoneNumber;
    profile.address = address;
    console.log(profile);
    try {
      console.log(profile);
      await profile.save();
      this.logger.verbose(
        `user profile with id ${profileId} updated successfully`,
      );
      return profile;
    } catch (error) {
      console.log(error);
      this.logger.error(
        `user with profile ${profileId} unsuccessfully updated`,
      );
      throw new InternalServerErrorException(
        `user with profile ${profileId} unsuccessfully updated`,
      );
    }
  };
  private extractPublicId(imageUrl: string): string {
    // Extract the public_id from the imageUrl
    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    return publicId;
  }
}
