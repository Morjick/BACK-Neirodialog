import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { createTransport } from 'nodemailer';

const transport = createTransport({
  secure: true,
  pool: true,
  logger: true,
  debug: true,
  host: 'smtp.yandex.ru',
  port: 465,
  auth: {
    user: 'neirodialog@yandex.ru',
    pass: 'wKLPEd1ojN',
  },
  ignoreTLS: true,
});

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [
    MailerModule.forRoot({
      transport,
      defaults: {
        from: 'Matvey <neirodialog@yandex.ru>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class MailModule {}
