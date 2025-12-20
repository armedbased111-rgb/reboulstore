FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 4001

# Commande par défaut (sera surchargée par docker-compose)
CMD ["npm", "run", "start:dev"]
