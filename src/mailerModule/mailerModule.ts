import { Module } from '@nestjs/common';
import { MailerService } from './mailerService';

@Module({
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
