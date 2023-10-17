import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AdminAuthService } from '../adminAuthService/adminAuthService';
import { AdminAuthCredentialsDto } from '../adminAuthDto/AdminAuthDto';

@Controller('adminAuth')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @Post('/adminSignup')
  async adminSignup(
    @Body(ValidationPipe) adminAuthCredentialsDto: AdminAuthCredentialsDto,
  ): Promise<string> {
    return await this.adminAuthService.adminSignup(adminAuthCredentialsDto);
  }
}
