#!/usr/bin/env python3
"""Envoie une alerte email (SMTP depuis .env.production). Usage: echo body | ./scripts/send-log-alert.py "Subject" """
import os
import smtplib
import sys
from email.mime.text import MIMEText
from pathlib import Path


def load_env_file(path: Path) -> dict[str, str]:
    out: dict[str, str] = {}
    if not path.is_file():
        return out
    for line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        out[key.strip()] = val.strip().strip('"').strip("'")
    return out


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: send-log-alert.py <subject>", file=sys.stderr)
        return 1

    root = Path(os.environ.get("REBOUL_ROOT", "/var/www/reboulstore"))
    env = {
        **load_env_file(root / ".env.production"),
        **load_env_file(root / ".env.observability"),
    }

    to_addr = env.get("LOG_ALERT_EMAIL") or env.get("SMTP_USER")
    if not to_addr:
        print("LOG_ALERT_EMAIL ou SMTP_USER manquant", file=sys.stderr)
        return 1

    host = env.get("SMTP_HOST")
    port = int(env.get("SMTP_PORT", "587"))
    user = env.get("SMTP_USER")
    password = env.get("SMTP_PASSWORD")
    if not all([host, user, password]):
        print("SMTP incomplet dans .env.production", file=sys.stderr)
        return 1

    body = sys.stdin.read()
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = sys.argv[1]
    msg["From"] = user
    msg["To"] = to_addr

    with smtplib.SMTP(host, port, timeout=30) as smtp:
        smtp.starttls()
        smtp.login(user, password)
        smtp.send_message(msg)

    print(f"Alert sent to {to_addr}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
