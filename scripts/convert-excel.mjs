// One-time converter: dutch-words.xlsx -> src/data/words.json
//
// Deliberately dependency-free. .xlsx is a zip of XML parts; both the widely
// used `xlsx` and `exceljs` packages carry unresolved/transitive vulnerability
// advisories, which is unnecessary risk for a script that just needs to read
// two columns out of one small trusted local file. So: read the zip's central
// directory by hand, inflate the two parts we need with Node's built-in zlib,
// and regex the tiny bit of XML we care about.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const xlsxPath = path.join(projectRoot, 'dutch-words.xlsx');
const outPath = path.join(projectRoot, 'src', 'data', 'words.json');

function readZipEntries(buf, names) {
  const eocdSig = 0x06054b50;
  let eocdOffset = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === eocdSig) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset === -1) throw new Error('Not a valid zip file (EOCD not found)');

  const totalEntries = buf.readUInt16LE(eocdOffset + 10);
  let cdOffset = buf.readUInt32LE(eocdOffset + 16);

  const wanted = new Map(names.map((n) => [n, null]));
  for (let i = 0; i < totalEntries; i++) {
    if (buf.readUInt32LE(cdOffset) !== 0x02014b50) break;
    const compressionMethod = buf.readUInt16LE(cdOffset + 10);
    const compressedSize = buf.readUInt32LE(cdOffset + 20);
    const fileNameLength = buf.readUInt16LE(cdOffset + 28);
    const extraLength = buf.readUInt16LE(cdOffset + 30);
    const commentLength = buf.readUInt16LE(cdOffset + 32);
    const localHeaderOffset = buf.readUInt32LE(cdOffset + 42);
    const fileName = buf.toString('utf8', cdOffset + 46, cdOffset + 46 + fileNameLength);

    if (wanted.has(fileName)) {
      const lFileNameLength = buf.readUInt16LE(localHeaderOffset + 26);
      const lExtraLength = buf.readUInt16LE(localHeaderOffset + 28);
      const dataStart = localHeaderOffset + 30 + lFileNameLength + lExtraLength;
      const compressed = buf.subarray(dataStart, dataStart + compressedSize);
      const raw = compressionMethod === 0 ? compressed : inflateRawSync(compressed);
      wanted.set(fileName, raw.toString('utf8'));
    }

    cdOffset += 46 + fileNameLength + extraLength + commentLength;
  }

  for (const [name, content] of wanted) {
    if (content === null) throw new Error(`Zip entry not found: ${name}`);
  }
  return wanted;
}

function decodeXmlEntities(str) {
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function parseSharedStrings(xml) {
  const strings = [];
  const siRe = /<si>([\s\S]*?)<\/si>/g;
  const tRe = /<t[^>]*>([\s\S]*?)<\/t>/g;
  let siMatch;
  while ((siMatch = siRe.exec(xml)) !== null) {
    let text = '';
    let tMatch;
    tRe.lastIndex = 0;
    while ((tMatch = tRe.exec(siMatch[1])) !== null) {
      text += tMatch[1];
    }
    strings.push(decodeXmlEntities(text));
  }
  return strings;
}

function colLetter(cellRef) {
  return cellRef.match(/^[A-Z]+/)[0];
}

function parseRows(xml, sharedStrings) {
  const rows = [];
  const rowRe = /<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
  const cellRe = /<c\b([^>]*)>(?:<v>([^<]*)<\/v>)?<\/c>/g;

  let rowMatch;
  while ((rowMatch = rowRe.exec(xml)) !== null) {
    const rowNum = Number(rowMatch[1]);
    if (rowNum === 1) continue; // header row

    const cells = {};
    let cellMatch;
    cellRe.lastIndex = 0;
    while ((cellMatch = cellRe.exec(rowMatch[2])) !== null) {
      const attrs = cellMatch[1];
      const refMatch = attrs.match(/r="([A-Z]+\d+)"/);
      if (!refMatch) continue;
      const isSharedString = /t="s"/.test(attrs);
      const rawValue = cellMatch[2];
      if (rawValue === undefined) continue;
      const value = isSharedString ? sharedStrings[Number(rawValue)] : decodeXmlEntities(rawValue);
      cells[colLetter(refMatch[1])] = value;
    }

    if (cells.A && cells.B) {
      rows.push({ dutch: cells.A, english: cells.B });
    }
  }
  return rows;
}

const buf = readFileSync(xlsxPath);
const entries = readZipEntries(buf, ['xl/sharedStrings.xml', 'xl/worksheets/sheet1.xml']);
const sharedStrings = parseSharedStrings(entries.get('xl/sharedStrings.xml'));
const words = parseRows(entries.get('xl/worksheets/sheet1.xml'), sharedStrings);

mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(words, null, 2) + '\n');

console.log(`Wrote ${words.length} words to ${path.relative(projectRoot, outPath)}`);
console.log('First:', words[0]);
console.log('Last:', words[words.length - 1]);
