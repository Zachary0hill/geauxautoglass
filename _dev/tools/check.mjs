import { themeCheckRun, Severity } from '@shopify/theme-check-node';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '../..');
const { offenses } = await themeCheckRun(root, undefined, () => {});
const sev = { [Severity.ERROR]: 'error', [Severity.WARNING]: 'warn', [Severity.INFO]: 'info' };
const counts = { error: 0, warn: 0, info: 0 };
for (const o of offenses) {
  counts[sev[o.severity]]++;
  const file = o.uri.replace(/^file:\/\//, '').replace(root + '/', '');
  console.log(`${sev[o.severity].padEnd(5)} ${file}:${o.start.line + 1}  [${o.check}] ${o.message}`);
}
console.log(`\n${counts.error} errors, ${counts.warn} warnings, ${counts.info} info`);
process.exit(counts.error ? 1 : 0);
