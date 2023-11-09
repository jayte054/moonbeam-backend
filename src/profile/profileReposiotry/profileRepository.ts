import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../profileEntity/profileEntity';

@Injectable()
export class ProfileRepository extends Repository<ProfileEntity> {}
