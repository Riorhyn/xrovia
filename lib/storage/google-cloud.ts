import crypto from "crypto";

type GoogleServiceAccount = { client_email: string; private_key: string; project_id: string };
let cachedToken: { value: string; expiresAt: number } | null = null;

function getCredentials(): GoogleServiceAccount {
  const client_email = process.env.GOOGLE_CLOUD_CLIENT_EMAIL;
  const private_key = process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const project_id = process.env.GOOGLE_CLOUD_PROJECT_ID;
  if (!client_email || !private_key || !project_id) throw new Error("Google Cloud Storage is not configured.");
  return { client_email, private_key, project_id };
}

function base64Url(input: string | Buffer) { return Buffer.from(input).toString("base64url"); }

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const credentials = getCredentials();
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({ iss: credentials.client_email, scope: "https://www.googleapis.com/auth/devstorage.read_write", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
  const unsigned = header + "." + payload;
  const signer = crypto.createSign("RSA-SHA256"); signer.update(unsigned); signer.end();
  const assertion = unsigned + "." + signer.sign(credentials.private_key, "base64url");
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }) });
  if (!response.ok) throw new Error("Google OAuth failed: " + response.status + " " + await response.text());
  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

function bucketName() {
  const bucket = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
  if (!bucket) throw new Error("GOOGLE_CLOUD_STORAGE_BUCKET is not configured.");
  return bucket;
}

export async function uploadToGoogleCloudStorage(objectName: string, data: Buffer, contentType: string) {
  const token = await getAccessToken();
  const url = "https://storage.googleapis.com/upload/storage/v1/b/" + encodeURIComponent(bucketName()) + "/o?uploadType=media&name=" + encodeURIComponent(objectName);
  const response = await fetch(url, { method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": contentType || "application/octet-stream", "Content-Length": String(data.length) }, body: data });
  if (!response.ok) throw new Error("Google Cloud Storage upload failed: " + response.status + " " + await response.text());
  return objectName;
}

export async function downloadFromGoogleCloudStorage(objectName: string) {
  const token = await getAccessToken();
  const url = "https://storage.googleapis.com/download/storage/v1/b/" + encodeURIComponent(bucketName()) + "/o/" + encodeURIComponent(objectName) + "?alt=media";
  const response = await fetch(url, { headers: { Authorization: "Bearer " + token } });
  if (!response.ok) throw new Error("Google Cloud Storage download failed: " + response.status);
  return response;
}

export async function deleteFromGoogleCloudStorage(objectName: string) {
  const token = await getAccessToken();
  const url = "https://storage.googleapis.com/storage/v1/b/" + encodeURIComponent(bucketName()) + "/o/" + encodeURIComponent(objectName);
  const response = await fetch(url, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
  if (response.status === 404) return;
  if (!response.ok) throw new Error("Google Cloud Storage delete failed: " + response.status + " " + await response.text());
}