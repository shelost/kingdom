import fs from 'node:fs';
const [src, out] = process.argv.slice(2);
const j = JSON.parse(fs.readFileSync(src, 'utf8'));
const data = j.data ?? j.result?.data;
fs.writeFileSync(out, Buffer.from(data, 'base64'));
console.log(out);
