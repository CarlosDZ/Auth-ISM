import { readFileSync } from 'fs';
import { join } from 'path';
const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
export const AppConfig = {
    baseUrl: pkg.AppConfig.baseUrl as string,
    emailDomain: pkg.AppConfig.emailDomain as string
};
