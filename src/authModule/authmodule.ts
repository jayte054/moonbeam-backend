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
    TypeOrmModule.forFeature([AuthRepository, AuthEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy, MailerService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
