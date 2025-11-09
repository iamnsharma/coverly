const deriveSecretKey = (baseKey = "coverly-key-derivation") =>
  crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(baseKey),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

const getAesKey = async (secretKey) =>
  crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode("coverly-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    secretKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

const buildKey = async () => {
  const secretKey = await deriveSecretKey();
  return getAesKey(secretKey);
};

const encodeBase64 = (buffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)));

const decodeBase64 = (value) =>
  Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

const STORAGE_KEY = "coverly.gemini.key";
const STORAGE_IV_KEY = "coverly.gemini.iv";

export const saveEncryptedKey = async (apiKey) => {
  if (!apiKey) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_IV_KEY);
    return;
  }
  const encryptionKey = await buildKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    encryptionKey,
    new TextEncoder().encode(apiKey)
  );

  localStorage.setItem(STORAGE_KEY, encodeBase64(encrypted));
  localStorage.setItem(STORAGE_IV_KEY, encodeBase64(iv));
};

export const loadDecryptedKey = async () => {
  const encryptedKey = localStorage.getItem(STORAGE_KEY);
  const storedIv = localStorage.getItem(STORAGE_IV_KEY);

  if (!encryptedKey || !storedIv) return null;

  try {
    const encryptionKey = await buildKey();
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: decodeBase64(storedIv),
      },
      encryptionKey,
      decodeBase64(encryptedKey)
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    return null;
  }
};

export const clearStoredKey = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_IV_KEY);
};

