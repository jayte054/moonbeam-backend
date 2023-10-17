import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './authController/authController';
import { AuthEntity } from './authEntity/authEntity';
import { AuthRepository } from './authRepository/authRepository';
import { AuthService } from './authService/authService';
import { JwtModule } from '@nestjs/jwt';
import config from 'config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt-strategy';
import { MailerModule } from 'src/mailerModule/mailerModule';
import { MailerService } from 'src/mailerModule/mailerService';
import { AdminAuthRepository } from './adminAuthRepository/adminAuthRepository';
import { AdminAuthService } from './adminAuthService/adminAuthService';
import { AdminAuthEntity } from './adminAuthEntity/adminAuthEntity';
import { AdminAuthController } from './adminAuthController/adminAuthController';

const jwtConfig: any | unknown = config.get('jwt');

@Module({
  imports: [
    MailerModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([
      AuthRepository,
      AuthEntity,
      AdminAuthRepository,
      AdminAuthEntity,
    ]),
  ],
  controllers: [AuthController, AdminAuthController],
  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy,
    MailerService,
    AdminAuthRepository,
    AdminAuthService,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
