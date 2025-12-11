# tourist-diary-v2

Turistický deník postavený na Reactu a Vite.

## Lokální vývoj
- `npm install` a `npm run dev` spustí aplikaci na `http://localhost:5173`.
- Testy běží přes `npm test`, lint přes `npm run lint`.
- Ve výchozím stavu (bez napojení na Keycloak) běží aplikace v demo módu a dovolí simulovat přihlášení.

## Keycloak
- Zkopírujte `.env.example` do `.env.local` a doplňte reálné hodnoty pro `VITE_KEYCLOAK_URL`, `VITE_KEYCLOAK_REALM` a `VITE_KEYCLOAK_CLIENT_ID`.
- Pokud je Keycloak dostupný pod jinou cestou pro adaptér, nastavte `VITE_KEYCLOAK_ADAPTER_URL`, jinak se použije `https://<keycloak>/js/keycloak.js`.
- Pro bezproblémové SSO je připraven soubor `public/keycloak-silent-check-sso.html`. Jeho URL nastavte do `VITE_KEYCLOAK_SILENT_CHECK_SSO` (např. `http://localhost:5173/keycloak-silent-check-sso.html`). Pokud proměnnou nedefinujete, použije se stejná výchozí adresa.
- Volitelné přesměrování po přihlášení/odhlášení lze řídit proměnnými `VITE_KEYCLOAK_LOGIN_REDIRECT` a `VITE_KEYCLOAK_LOGOUT_REDIRECT`.
- Po správném nastavení proměnných AuthContext automaticky načte Keycloak adaptér, provede `check-sso` a zpřístupní stav přihlášení (`useAuth`).
