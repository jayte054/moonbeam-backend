import { ConflictException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailerModule/mailerService';
import { DataSource, Repository } from 'typeorm';
import { AdminAuthEntity } from '../adminAuthEntity/adminAuthEntity';
import { AdminAuthCredentialsDto } from '../adminAuthDto/AdminAuthDto';

@Injectable()
export class AdminAuthRepository extends Repository<AdminAuthEntity> {
  private logger = new Logger('AdminAuthRepository');
  constructor(
    private dataSource: DataSource,
    private readonly mailerService: MailerService,
  ) {
    super(AdminAuthEntity, dataSource.createEntityManager());
  }

  async adminSignUp(
    adminAuthCredentialsDto: AdminAuthCredentialsDto,
  ): Promise<string> {
    const { firstname, lastname, phoneNumber, email, password } =
      adminAuthCredentialsDto;

    const salt = await bcrypt.genSalt();

    const admin = new AdminAuthEntity();
    admin.firstname = firstname;
    admin.lastname = lastname;
    admin.phoneNumber = phoneNumber;
    admin.email = email;
    admin.salt = salt;
    admin.password = await bcrypt.hash(password, salt);

    try {
      await admin.save();
      this.logger.verbose(`New admin with id of ${admin.id} has been created`);
      await this.mailerService.sendAdminWelcomeMail(admin.email);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('email already exists');
      } else {
        console.log(error);
        this.logger.error('error creating user');
        return 'error creating user';
      }
    }
    return `admin ${JSON.stringify({
      firstname: admin.firstname,
      lastname: admin.lastname,
      phoneNumber: admin.phoneNumber,
      email: admin.email,
      admin: admin.isAdmin,
    })} successfully created`;
  }
}
