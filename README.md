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

---
