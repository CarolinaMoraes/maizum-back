import { MailerService } from '@nestjs-modules/mailer';

export async function sendEmail(
  mailerService: MailerService,
  toAddress: string,
  subject: string,
  template: string,
  context: object,
): Promise<void> {
  mailerService.sendMail({
    to: toAddress,
    subject,
    template,
    context,
  });
}
