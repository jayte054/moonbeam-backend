import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Request,
  Body,
  Param,
  Get,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { GetUser } from 'src/authModule/getUserDecorator/getUserDecorator';
import { CreateProfileDto, UpdateProfileDto } from '../profileDto/profileDto';
import { ProfileEntity } from '../profileEntity/profileEntity';
import { ProfileService } from '../profileService/profileService';

@Controller('profile')
@UseGuards(AuthGuard())
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('/createProfile')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async postProfile(
    @GetUser() user: AuthEntity,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: Request | any,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<ProfileEntity | any> {
    return await this.profileService.createProfile(user, createProfileDto, req);
  }

  @Get('getProfile')
  async getProfile(
    @GetUser() user: AuthEntity,
  ): Promise<ProfileEntity | any> {
    return await this.profileService.getProfile(user);
  }

  @Patch('updateProfile/:id')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async updateProfile(
    @Param('profileId') profileId: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @GetUser() user: AuthEntity,
    @Request() req: Request | any,
  ): Promise<ProfileEntity | any> {
    return await this.profileService.updateProfile(
      profileId,
      updateProfileDto,
      user,
      req,
    );
  }
}
