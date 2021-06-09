import path from 'path';
import { fileURLToPath } from 'url';

export function __dirname(url) {
  return path.dirname(fileURLToPath(url));
}
