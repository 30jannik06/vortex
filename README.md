# Vortex

Homelab-Control-Center-Dashboard im Konsolen-/Rack-Panel-Design. Läuft dauerhaft auf einem Raspberry Pi Zero 2W im Heimnetz und steuert einen Gaming-PC per Wake-on-LAN, zeigt Netzwerk-Status und bündelt Homelab-Tools an einem Ort.

Stack: Next.js (App Router, TypeScript) · Tailwind CSS v4 · shadcn/ui · Prisma + SQLite

## Routen

| Route       | Inhalt                                                             |
| ----------- | ------------------------------------------------------------------- |
| `/`         | Übersicht mit Link-Cards + Pi-Telemetrie (CPU/RAM/Temp/Uptime)     |
| `/pc`       | Power-Button (Wake-on-LAN), Geräteinfo, Aktions-Verlauf            |
| `/network`  | Internet/Router/PC-Status, Tabelle bekannter Geräte                |
| `/tools`    | Homelab-Werkzeuge (RDP, Router-Login, Logs, System-Status)         |

## Setup

```bash
pnpm install
cp .env.example .env
# .env ausfüllen: DEVICE_MAC/DEVICE_IP für den Gaming-PC, API_TOKEN/NEXT_PUBLIC_API_TOKEN identisch setzen
pnpm db:migrate
pnpm dev
```

`pnpm install` generiert den Prisma-Client automatisch (`postinstall`). Nach Schema-Änderungen erneut `pnpm db:migrate` ausführen.

## Deployment auf den Raspberry Pi

Der Build läuft **immer lokal** (nie auf der Zero 2W selbst):

```bash
pnpm build
```

Danach `public/` und `.next/static` manuell in den standalone-Output kopieren (Next.js kopiert sie dort standardmäßig nicht hinein):

```bash
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
```

Prisma nutzt ab v7 keine Rust-Query-Engine mehr, sondern den `@prisma/adapter-libsql`-Treiber — dessen native Bindings werden ganz normal von `next build`s File-Tracing mit in den standalone-Output aufgenommen. Damit die passenden `linux-arm64`-Binaries (für den Pi) beim lokalen Windows-Build überhaupt heruntergeladen werden, ist in `.npmrc` `supportedArchitectures` entsprechend gesetzt.

Anschließend `.next/standalone/`, `data/` (SQLite-DB) und `.env` per `rsync`/`scp` auf den Pi kopieren und dort per systemd starten:

```ini
[Unit]
Description=Vortex Dashboard
After=network.target

[Service]
ExecStart=/usr/bin/node /opt/vortex/server.js
Restart=on-failure
Environment=PORT=3000
Environment=DATABASE_URL=file:/opt/vortex/data/vortex.db
User=pi

[Install]
WantedBy=multi-user.target
```

Auf dem Pi selbst: kein Docker, kein `npm install` — nur `node server.js` aus dem standalone-Output.

## Sicherheit

Die API-Routes (v.a. `/api/wol`, `/api/ping`) sind per einfachem Bearer-Token geschützt (`API_TOKEN` / `NEXT_PUBLIC_API_TOKEN`). Das schützt vor versehentlicher Erreichbarkeit außerhalb des VPNs, ersetzt aber kein echtes Auth-System — das Dashboard ist für den Betrieb im eigenen (V)LAN gedacht.

## Lizenz

MIT, siehe [LICENSE](./LICENSE).
