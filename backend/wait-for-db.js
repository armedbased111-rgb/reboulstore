#!/usr/bin/env node

// Script pour attendre que PostgreSQL soit prêt avant de démarrer le backend
const { execSync } = require('child_process');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 5432;
const username = process.env.DB_USERNAME || 'postgres';
const password = process.env.DB_PASSWORD || 'postgres';
const database = process.env.DB_DATABASE || 'reboulstore_db';

console.log('⏳ Attente de la base de données PostgreSQL...');
console.log(`   Host: ${host}`);
console.log(`   Port: ${port}`);
console.log(`   User: ${username}`);
console.log(`   Database: ${database}`);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  let retries = 30; // 30 tentatives maximum
  let connected = false;

  while (retries > 0 && !connected) {
    try {
      // Vérifier que le port est ouvert avec netcat
      execSync(`nc -z ${host} ${port}`, { stdio: 'ignore' });
      connected = true;
      console.log('✅ PostgreSQL est prêt !');
    } catch (error) {
      retries--;
      if (retries > 0) {
        console.log(`   PostgreSQL n'est pas encore prêt - ${retries} tentatives restantes...`);
        await sleep(2000); // Attendre 2 secondes
      }
    }
  }

  if (!connected) {
    console.error('❌ Impossible de se connecter à PostgreSQL après 30 tentatives');
    process.exit(1);
  }

  // Exécuter la commande passée en argument
  const command = process.argv.slice(2).join(' ');
  if (command) {
    execSync(command, { stdio: 'inherit' });
  }
})();

if (!connected) {
  console.error('❌ Impossible de se connecter à PostgreSQL après 30 tentatives');
  process.exit(1);
}

// Exécuter la commande passée en argument
const command = process.argv.slice(2).join(' ');
if (command) {
  execSync(command, { stdio: 'inherit' });
}
