import { randomInt } from 'crypto';

// Excludes visually ambiguous characters (0/O, 1/I/L) to keep printed/scanned codes unambiguous.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const LENGTH = 8;

export function generateQrCodeId(): string {
  let id = '';
  for (let i = 0; i < LENGTH; i++) {
    id += ALPHABET[randomInt(ALPHABET.length)];
  }
  return id;
}
