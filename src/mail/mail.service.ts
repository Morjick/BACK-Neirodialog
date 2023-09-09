import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendMailContract } from './contracts/SendMail.contract';
import { createTransport } from 'nodemailer';

const transport = createTransport({
  service: 'Yandex',
  secure: true,
  pool: true,
  host: 'smtp.yandex.ru',
  port: 465,
  auth: {
    user: 'neirodialog@yandex.ru',
    pass: 'mrjwtlwsjkbqfoet',
  },
  logger: true,
  debug: true,
});

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendMail(body: SendMailContract) {
    try {
      const sender = body.from || 'neirodialog@yandex.ru';

      transport
        .sendMail({
          to: [body.email], // list of receivers
          from: sender,
          subject: 'Testing Nest MailerModule ✔', // Subject line
          text: body.text,
          html: '<b>Welcome</b>',
        })
        .then(() => {
          console.log('Отправили письмо');
        })
        .catch((e) => {
          console.log('Не отправили письмо', e);
        });
    } catch (e) {
      return {
        message: 'Ошибка при отправке электронного письма',
        ok: false,
        status: 501,
        error: e,
      };
    }
  }
}
