# Puppeteer Webscraper × Google Cloud Functions (Gen2)

A minimal, production-ready template to run **Puppeteer** (with `puppeteer-extra` + Stealth) inside **Google Cloud Functions (2nd gen)**.

> Works for headless scraping, metadata extraction, screenshots, and HTML snapshots—without custom Docker.

---

## 1) Architecture

* **HTTP Cloud Function (Gen2)** → runs on Cloud Run under the hood
* **Node 20** runtime
* **Puppeteer** launched with GCF-safe flags (`--no-sandbox`, `--disable-dev-shm-usage`, etc.)
* Optional: **Stealth plugin** to reduce bot fingerprint

---

## 2) Requirements

* Node 18/20 locally
* gcloud CLI authenticated to your GCP project
* Billing enabled
* IAM: role `Cloud Functions Developer` (deploy), `Cloud Functions Invoker` (call)

---

## 3) Project structure

```
puppeteer-gcf/
├── package.json
├── index.js            # the function
└── README.md
```

# Instrucciones

## 1. Instalar Google Cloud CLI en Linux

```bash
# Actualizar repos
sudo apt-get update

# Instalar dependencias
sudo apt-get install apt-transport-https ca-certificates gnupg -y

# Añadir repo oficial de Google Cloud
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | \
  sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list

# Importar la clave GPG
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | \
  sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg

# Instalar Google Cloud CLI
sudo apt-get update && sudo apt-get install google-cloud-cli -y

# Verificar instalación
gcloud version
```

---

## 2. Autenticación y configuración

```bash
# Iniciar sesión
gcloud auth login

# Seleccionar proyecto
gcloud config set project <PROJECT_ID>

# (Opcional) fijar región por defecto
gcloud config set functions/region us-central1
```

---

## 3. Habilitar APIs necesarias

```bash
gcloud services enable cloudfunctions.googleapis.com run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com
```

---

## 4. Desplegar función con Puppeteer

Asegúrate de tener en `package.json`:

```json
"scripts": {
  "gcp-build": "PUPPETEER_CACHE_DIR=/workspace/.cache/puppeteer npx puppeteer browsers install chrome"
}
```

Y luego despliega con:

```bash
gcloud functions deploy getWebsiteData \
  --runtime=nodejs22 \
  --trigger-http \
  --region=us-central1 \
  --allow-unauthenticated \
  --timeout=120s \
  --memory=1024MB \
  --update-env-vars PUPPETEER_CACHE_DIR=/workspace/.cache/puppeteer
```

---

## 5. Probar la función

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' \
  https://us-central1-<PROJECT_ID>.cloudfunctions.net/getWebsiteData
```

---

## 6. Ver logs

```bash
gcloud functions logs read getWebsiteData --region=us-central1 --limit=100
```

---

