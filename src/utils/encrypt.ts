// src/utils/encrypt.js
//import JSEncrypt from "jsencrypt"; // npm i jsencrypt
import { useAuthStore } from "../store/modules/auth";

// 用公钥加密
// export function encryptPassword(password) {
//   const publicKey = store.getState().auth.publicKey;
//   if (!publicKey) throw new Error("公钥为空");
//   const encrypt = new JSEncrypt();
//   encrypt.setPublicKey(publicKey);
//   const encrypted = encrypt.encryptOAEP(password);
//   if (!encrypted) throw new Error("密码加密失败");
//   return encrypted;
// }
// ✅ 替换掉原来 JSEncrypt 的 encryptPassword
// 后端返回的是 SPKI PEM 公钥: "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"

// ✅ 完整正确的 encryptPassword —— 直接复制替换
export async function encryptPassword(password: string) {
  const store = useAuthStore();
  const publicKeyPem = store.publicKey;
  if (!publicKeyPem) throw new Error("公钥为空");

  // 1. PEM → DER ArrayBuffer
  const pemContent = publicKeyPem
    .replace("-----BEGIN PUBLIC KEY-----", "")
    .replace("-----END PUBLIC KEY-----", "")
    .replace(/\n/g, "");
  const derBytes = Uint8Array.from(atob(pemContent), (c) => c.charCodeAt(0));

  // 2. 导入公钥 (SPKI + SHA-256)
  const publicKey = await crypto.subtle.importKey(
    "spki",
    derBytes.buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"],
  );

  // 3. ✅ TextEncoder → 正确 UTF-8 bytes
  const passwordBytes = new TextEncoder().encode(password);

  // 4. RSA-OAEP-SHA256 加密
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "RSA-OAEP"}, //hash: "SHA-256" },
    publicKey,
    passwordBytes,
  );

  // 5. ✅ 关键！正确的 base64 编码
  //    绝对不能用 encryptedBytes.toString() → 那是 "[255,252,...]" 格式！
  const encryptedBytes = new Uint8Array(encryptedBuffer);
  let binary = "";
  for (let i = 0; i < encryptedBytes.length; i++) {
    binary += String.fromCharCode(encryptedBytes[i]);
  }
  const base64Ciphertext = btoa(binary);
  //console.log("base64Ciphertext", base64Ciphertext);
  // base64Ciphertext 应该长这样: "f/u8Kw8fPnJQw4Lm2k1..."
  // 绝对不能以 [ 开头！
  return base64Ciphertext;
}
