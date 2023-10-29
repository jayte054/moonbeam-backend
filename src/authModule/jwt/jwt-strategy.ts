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

  async validate(payload: JwtPayload): Promise<AuthEntity | AdminAuthEntity> {
    const { id, email } = payload;

    const userQueryBuilder = this.authRepository.createQueryBuilder('user');
    userQueryBuilder
      .select([
        'user.id',
        'user.email',
        'user.password',
        'user.salt',
        'user.isAdmin',
      ])
      .where('user.email = :email', { email: email, id });

    const adminQueryBuilder =
      this.adminAuthRepository.createQueryBuilder('admin');
    adminQueryBuilder
      .select([
        'admin.id',
        'admin.email',
        'admin.password',
        'admin.salt',
        'admin.isAdmin',
      ])
      .where('admin.email = :email', { email: email, id });

    const [user, admin] = await Promise.all([
      userQueryBuilder.getOne(),
      adminQueryBuilder.getOne(),
    ]);

    if (!user && !admin) {
      console.log('auth: user and admin unauthorized');
      throw new UnauthorizedException();
    } else {
      return user || admin;
    }
  }

  // async validate(payload: JwtPayload): Promise<AuthEntity | AdminAuthEntity> {
  //   const { id, email } = payload;

  //   const queryBuilder = this.authRepository.createQueryBuilder('user');
  //   queryBuilder
  //     .select([
  //       'user.id',
  //       'user.email',
  //       'user.password',
  //       'user.salt',
  //       'user.isAdmin',
  //     ])
  //     .where('user.email = :email', { email: email, id });

  //   const user = await queryBuilder.getOne();

  //   const adminQueryBuilder =
  //     this.adminAuthRepository.createQueryBuilder('admin');
  //   adminQueryBuilder
  //     .select([
  //       'admin.id',
  //       'admin.email',
  //       'admin.password',
  //       'admin.salt',
  //       'admin.isAdmin',
  //     ])
  //     .where('admin.email = : email', { email: email, id });

  //   const admin = await adminQueryBuilder.getOne();

  //   if (!user) {
  //     console.log('auth: user unauthorized');
  //     throw new UnauthorizedException();
  //   } else if (!admin) {
  //     console.log('auth: admin unauthorized');
  //     throw new UnauthorizedException();
  //   } else {
  //     const response = user.id;
  //     console.log(response);
  //     return user || admin;
  //   }
  // }

  // async adminValidate(payload: JwtPayload): Promise<AdminAuthEntity> {
  //   const { id, email } = payload;

  //   const queryBuilder = this.adminAuthRepository.createQueryBuilder('admin');
  //   queryBuilder
  //     .select([
  //       'admin.id',
  //       'admin.email',
  //       'admin.password',
  //       'admin.salt',
  //       'admin.isAdmin',
  //     ])
  //     .where('admin.email = :email', { email: email, id });

  //   const admin = await queryBuilder.getOne();
  //   console.log('here');

  //   if (!admin) {
  //     console.log('auth: admin unauthorized');
  //     throw new UnauthorizedException();
  //   }
  //   const response = admin.id;
  //   console.log(response);
  //   return admin;
  // }
}
