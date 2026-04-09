import type { ConfigService } from '@nestjs/config';

/** PNG — `c_scale,h_96` conserve le ratio ; affichage mail à 48px CSS (= retina). */
const DEFAULT_EMAIL_LOGO =
  'https://res.cloudinary.com/dxen69pdo/image/upload/c_scale,h_96,q_auto:best,f_png/v1753365190/logo_w_hzhfoc.png';

export function getEmailLogoUrl(config: ConfigService): string {
  const fromEnv = config.get<string>('EMAIL_LOGO_URL')?.trim();
  return fromEnv || DEFAULT_EMAIL_LOGO;
}
