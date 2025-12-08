FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Copier le reste du code
COPY . .

# Rendre le script d'entrée exécutable
RUN chmod +x /app/docker-entrypoint.sh

# Exposer le port
EXPOSE 3001

# Utiliser le script d'entrée
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Commande par défaut (sera surchargée par docker-compose)
CMD ["npm", "run", "start:dev"]