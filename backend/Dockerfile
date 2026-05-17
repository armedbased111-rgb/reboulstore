FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Copier le reste du code
COPY . .

# Entrypoint dev (pas de chown/su-exec — réservé à Dockerfile.prod)
RUN chmod +x /app/docker-entrypoint.dev.sh

EXPOSE 3001

ENTRYPOINT ["/app/docker-entrypoint.dev.sh"]

# Commande par défaut (sera surchargée par docker-compose)
CMD ["npm", "run", "start:dev"]