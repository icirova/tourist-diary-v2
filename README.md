# tourist-diary-v2

Turistický deník s React frontendem, vlastním Node API, Keycloak autentizací, PostgreSQL databází a fotografiemi na serverovém disku. Nepřihlášení vidí pouze lokální demo; přihlášení pracují výhradně se svým soukromým deníkem.

## Architektura

- Keycloak přihlašuje uživatele a vydává JWT; veřejný frontend používá Authorization Code Flow s PKCE a neobsahuje client secret.
- Fastify API ověřuje podpis, issuer a client každého tokenu přes Keycloak JWKS.
- `owner_id` se vždy bere z tokenu, nikdy z klientského payloadu.
- PostgreSQL ukládá výlety a metadata; fotografie jsou mimo Git v trvalém svazku a zobrazují se přes krátkodobé podepsané URL.

## Keycloak

V realm vytvořte public klienta `tourist-diary-web`:

- Client authentication: Off
- Standard flow: On
- PKCE method: S256
- Valid redirect URIs: `http://localhost:5173/*` a produkční URL
- Web origins: `http://localhost:5173` a produkční origin
- User registration: Off

Vytvořte realm nebo client roli `admin` a přiřaďte ji prvnímu účtu. Backend přijímá roli z `realm_access.roles` i `resource_access[client].roles`.

## PostgreSQL a backend

```bash
cd server
cp .env.example .env
npm install
npm run migrate
npm start
```

`DATABASE_URL` musí mířit na existující PostgreSQL. `PHOTO_SIGNING_SECRET` vytvořte například pomocí `openssl rand -hex 32`. Adresář `UPLOADS_DIR` musí být zapisovatelný a zálohovaný. Databázový uživatel potřebuje práva vytvářet tabulky a rozšíření `pgcrypto` při první migraci.

## Frontend

Zkopírujte `.env.example` do `.env.local`, nastavte veřejnou adresu Keycloak, realm a client ID a spusťte:

```bash
npm install
npm run dev
```

Vite proxy není potřeba v produkci; nginx směruje `/api/` na službu `backend:8080`. Pro lokální vývoj spusťte frontend za stejnou reverzní proxy nebo doplňte proxy `/api` na `localhost:8080`.

## Docker

`docker-compose.yml` sestaví frontend a backend, ale používá již existující externí PostgreSQL a Keycloak. Před spuštěním vytvořte `server/.env` a kořenový `.env` s hodnotami `VITE_KEYCLOAK_*`, spusťte migraci a poté `docker compose up -d --build`.

## Limity a zálohy

API vynucuje 100 výletů, 3 fotografie na výlet, 750 kB na fotografii a 50 MB fotografií na uživatele. Zálohujte PostgreSQL i svazek fotografií společně; samotná databáze neobsahuje obrazová data.

## Retence účtů

Po nastavení SMTP a servisního Keycloak klienta zapněte `RETENTION_ENABLED=true`. Servisní klient musí mít service accounts a roli `realm-management/manage-users`; jeho secret patří pouze do `server/.env`. Backend jednou denně:

- po 5 měsících neaktivity odešle upozornění,
- po 6 měsících účet v aplikační databázi přesune do 30denní karantény,
- po karanténě odstraní účet z Keycloaku, data z PostgreSQL a soubory,
- nikdy automaticky nemaže účet s rolí `admin`.

Pro ruční obnovení před smazáním nastavte uživateli `status='active'`, obnovte `last_active_at` a vynulujte `warned_at` a `scheduled_delete_at`.
