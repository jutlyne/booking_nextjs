import CryptoJS from 'crypto-js';

const SECRET = process.env.NEXTAUTH_SECRET as string;

export const encryptToken = (text: string) => {
  return CryptoJS.AES.encrypt(text, SECRET).toString();
};

export const decryptToken = (cipherText: string) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};
