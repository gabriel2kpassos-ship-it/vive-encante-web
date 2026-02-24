import fs from "node:fs";
import path from "node:path";
import admin from "firebase-admin";

function getServiceAccount() {
  // 1) Prioridade: JSON no env (produção)
  const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;
  if (raw?.trim()) {
    const json = JSON.parse(raw);
    if (typeof json.private_key === "string") {
      json.private_key = json.private_key.replace(/\\n/g, "\n");
    }
    return json;
  }

  // 2) Fallback: arquivo local (desenvolvimento)
  const p = path.join(process.cwd(), "serviceAccountKey.json");
  if (!fs.existsSync(p)) return null;
  const json = JSON.parse(fs.readFileSync(p, "utf8"));
  if (typeof json.private_key === "string") {
    json.private_key = json.private_key.replace(/\\n/g, "\n");
  }
  return json;
}

export function getAdminApp() {
  if (admin.apps.length) return admin.app();

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    throw new Error("Missing Firebase Admin service account (env or serviceAccountKey.json)");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return admin.app();
}
