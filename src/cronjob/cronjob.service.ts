import {Injectable} from '@nestjs/common';
import {Cron} from '@nestjs/schedule';
import {MailerService} from '@nestjs-modules/mailer';

@Injectable()
export class CronjobService {
  constructor(private readonly mailerService: MailerService) {
  }

  generateFormattedDate(): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const currentDate = new Date();
    const day = currentDate.getDate();
    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();

    return `${day}-${months[monthIndex]}-${year}`;
  }

  @Cron('0 10 * * * *')
  async handleCron() {
    const date = this.generateFormattedDate();
    await this.mailerService
        .sendMail({
          to: 'irfan.akbarihabibi@gmail.com', // list of receivers
          from: 'noreply@vuteq.co.id', // sender address
          subject: 'Pallet Belum Kembali Per Tanggal ' + date, // Subject line
          template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
          context: {
            // Data to be sent to template engine.
            code: 'Pallet Control System',
            username: 'Selpian',
          },
        })
  }
}
