import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { NewsletterSubscription } from '../../entities/newsletter-subscription.entity';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { getPublicSiteUrl } from '../../config/public-site-url';
import { getEmailLogoUrl } from '../../config/email-assets';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);
  private readonly frontendUrl: string;
  private readonly emailLogoUrl: string;

  constructor(
    @InjectRepository(NewsletterSubscription)
    private readonly repo: Repository<NewsletterSubscription>,
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {
    this.frontendUrl = getPublicSiteUrl(this.config);
    this.emailLogoUrl = getEmailLogoUrl(this.config);
  }

  async subscribe(dto: SubscribeNewsletterDto): Promise<{
    ok: true;
    alreadySubscribed: boolean;
  }> {
    const source = dto.source?.slice(0, 64) || null;
    const existing = await this.repo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      return { ok: true, alreadySubscribed: true };
    }

    await this.repo.save(this.repo.create({ email: dto.email, source }));

    const year = new Date().getFullYear();
    try {
      await this.mailerService.sendMail({
        to: dto.email,
        subject: 'Reboul Store — inscription newsletter',
        template: 'newsletter-welcome',
        context: {
          email: dto.email,
          frontendUrl: this.frontendUrl,
          emailLogoUrl: this.emailLogoUrl,
          currentYear: year,
          emailTitle: 'Inscription newsletter · Reboul Store',
          datum: 'COMMS // RBL-NS-WELCOME',
        },
      });
    } catch (e) {
      this.logger.error(`newsletter welcome failed for ${dto.email}`, e);
    }

    const smtpUser = this.config.get<string>('SMTP_USER')?.trim() ?? '';
    if (smtpUser) {
      try {
        await this.mailerService.sendMail({
          to: smtpUser,
          subject: `[Newsletter] Nouvelle inscription — ${dto.email}`,
          template: 'newsletter-admin-notify',
          context: {
            email: dto.email,
            source: source || '—',
            subscribedAt: new Date().toISOString(),
            currentYear: year,
            frontendUrl: this.frontendUrl,
            emailLogoUrl: this.emailLogoUrl,
            emailTitle: 'Alerte newsletter · Reboul Store',
            datum: 'INTERNAL // RBL-NS-ADM',
          },
        });
      } catch (e) {
        this.logger.error('newsletter admin notify failed', e);
      }
    }

    return { ok: true, alreadySubscribed: false };
  }
}
