#!/bin/sh
set -e

# Prod uniquement (Dockerfile.prod crée l'utilisateur nestjs)
if [ "$(id -u)" = "0" ] && id nestjs >/dev/null 2>&1 && command -v su-exec >/dev/null 2>&1; then
  mkdir -p /app/logs
  chown -R nestjs:nodejs /app/logs
  exec su-exec nestjs:nodejs "$@"
fi

exec "$@"
