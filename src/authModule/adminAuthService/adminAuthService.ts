import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminAuthRepository } from '../adminAuthRepository/adminAuthRepository';
import { AdminAuthCredentialsDto } from '../adminAuthDto/AdminAuthDto';

@Injectable()
export class AdminAuthService {
  private logger = new Logger('AdminAuthService');
  constructor(
    @InjectRepository(AdminAuthRepository)
    private adminAuthRepository: AdminAuthRepository,
  ) {}

  //========= admin signup ==========

  async adminSignup(
    adminAuthCredentialsDto: AdminAuthCredentialsDto,
  ): Promise<string> {
    return await this.adminAuthRepository.adminSignUp(adminAuthCredentialsDto);
  }
}
