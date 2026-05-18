#!/usr/bin/env bash
# ACL pour que le backend Docker (user nestjs uid 1001) écrive dans sortant/
# Usage sur le VPS : sudo ./scripts/setup-as400-sortant-acl.sh
set -euo pipefail

SORTANT_DIR="${1:-/var/sftp/as400/sortant}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo $0"
  exit 1
fi

if ! command -v setfacl >/dev/null 2>&1; then
  echo "setfacl not found. Install acl package or configure group write on ${SORTANT_DIR}"
  exit 1
fi

mkdir -p "${SORTANT_DIR}"
setfacl -m u:1001:rwx "${SORTANT_DIR}"
setfacl -d -m u:1001:rwx "${SORTANT_DIR}"
echo "ACL applied for uid 1001 on ${SORTANT_DIR}"
getfacl "${SORTANT_DIR}" | head -20
