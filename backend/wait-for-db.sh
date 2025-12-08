#!/bin/sh
# Script pour attendre que PostgreSQL soit prêt avant de démarrer le backend

set -e

host="$1"
port="$2"
user="$3"
password="$4"
database="$5"
shift 5
cmd="$@"

echo "⏳ Attente de la base de données PostgreSQL..."
echo "   Host: $host"
echo "   Port: $port"
echo "   User: $user"
echo "   Database: $database"

until PGPASSWORD="$password" psql -h "$host" -p "$port" -U "$user" -d "$database" -c '\q' > /dev/null 2>&1; do
  >&2 echo "   PostgreSQL n'est pas encore prêt - en attente..."
  sleep 1
done

>&2 echo "✅ PostgreSQL est prêt !"
exec $cmd
