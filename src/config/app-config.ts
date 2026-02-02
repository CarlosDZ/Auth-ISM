import { readFileSync } from 'fs';
import { join } from 'path';
const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
export const AppConfig = {
    baseUrl: pkg.appConfig.baseUrl as string,
    emailDomain: pkg.appConfig.emailFrom as string
};
