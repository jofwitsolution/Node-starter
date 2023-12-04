import crypto from "crypto";

export function generateUniqueChars(length = 32) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

export function genRandomDigits(length) {
  let code = "";
  const characters = "1234567890";
  const charSize = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charSize);
    code += characters[randomIndex];
  }

  return code;
}
