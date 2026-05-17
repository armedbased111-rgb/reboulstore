import { Logger } from '@nestjs/common';
import { getRequestId } from './request-context';

/** Logs structurés JSON (parsables par Loki / Promtail plus tard). */
export function logEvent(
  logger: Logger,
  level: 'warn' | 'error' | 'log',
  payload: Record<string, unknown>,
) {
  const requestId = getRequestId();
  const line = JSON.stringify({
    ...payload,
    ...(requestId ? { requestId } : {}),
    ts: new Date().toISOString(),
  });
  if (level === 'error') logger.error(line);
  else if (level === 'warn') logger.warn(line);
  else logger.log(line);
}
