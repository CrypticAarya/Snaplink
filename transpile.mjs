import fs from 'fs';
import * as esbuild from 'esbuild';

const inputDir = '/tmp/charm-url-booster/src/components';
const outputDir = '/Users/kartikk/Downloads/edits /SHORTIFY/src/components';

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.tsx'));
for (const file of files) {
  const content = fs.readFileSync(`${inputDir}/${file}`, 'utf8');
  const result = await esbuild.transform(content, { loader: 'tsx', format: 'esm', jsx: 'preserve' });
  fs.writeFileSync(`${outputDir}/${file.replace('.tsx', '.jsx')}`, result.code);
}
console.log('Done!');
