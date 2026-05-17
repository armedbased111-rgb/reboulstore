import { Logger } from '@nestjs/common';

/** Logs structurés JSON (parsables par Loki / Promtail plus tard). */
export function logEvent(
  logger: Logger,
  level: 'warn' | 'error' | 'log',
  payload: Record<string, unknown>,
) {
  const line = JSON.stringify({ ...payload, ts: new Date().toISOString() });
  if (level === 'error') logger.error(line);
  else if (level === 'warn') logger.warn(line);
  else logger.log(line);
}
