import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as esbuild from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputDir = '/tmp/charm-url-booster/src/components';
const outputDir = path.join(__dirname, 'src', 'components');

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.tsx'));
for (const file of files) {
  const content = fs.readFileSync(`${inputDir}/${file}`, 'utf8');
  const result = await esbuild.transform(content, { loader: 'tsx', format: 'esm', jsx: 'preserve' });
  fs.writeFileSync(`${outputDir}/${file.replace('.tsx', '.jsx')}`, result.code);
}
console.log('Done!');
