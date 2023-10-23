import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import config from 'config';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from '../authRepository/authRepository';
import { AuthEntity } from '../authEntity/authEntity';
import { AdminAuthRepository } from '../adminAuthRepository/adminAuthRepository';
import { AdminAuthEntity } from '../adminAuthEntity/adminAuthEntity';

const jwtConfig: any | unknown = config.get('jwt');

//====== jwt strategy ========

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AuthRepository)
    @InjectRepository(AdminAuthRepository)
    private authRepository: AuthRepository,
    private adminAuthRepository: AdminAuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || jwtConfig.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthEntity> {
    const { id, email } = payload;

    const queryBuilder = this.authRepository.createQueryBuilder('user');
    queryBuilder
      .select([
        'user.id',
        'user.email',
        'user.password',
        'user.salt',
        'user.isAdmin',
      ])
      .where('user.email = :email', { email: email, id });

    const user = await queryBuilder.getOne();

    if (!user) {
      console.log('auth: unauthorized');
      throw new UnauthorizedException();
    }
    const response = user.id;
    console.log(response);
    return user;
  }

  async adminValidate(payload: JwtPayload): Promise<AdminAuthEntity> {
    const { id, email } = payload;

    const queryBuilder = this.adminAuthRepository.createQueryBuilder('admin');
    queryBuilder
      .select([
        'admin.id',
        'admin.email',
        'admin.password',
        'admin.salt',
        'admin.isAdmin',
      ])
      .where('admin.email = :email', { email: email, id });

    const admin = await queryBuilder.getOne();
    console.log('here');

    if (!admin) {
      console.log('auth: unauthorized');
      throw new UnauthorizedException();
    }
    const response = admin.id;
    console.log(response);
    return admin;
  }
}
