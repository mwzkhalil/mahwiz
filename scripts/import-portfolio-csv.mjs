import { readFile, rename, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePortfolioCsv } from './lib/portfolio-csv.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const input = resolve(process.argv[2] ?? resolve(ROOT, 'data/portfolio.csv'));
const output = resolve(ROOT, 'src/data/generated/portfolio.json');

try {
  const source = await readFile(input, 'utf8');
  const report = parsePortfolioCsv(source);
  const snapshot = {
    importedAt: new Date().toISOString(),
    source: input,
    records: report.records,
    validation: {
      unknownColumns: report.unknownColumns,
      privateColumns: report.privateColumns,
      conflicts: report.conflicts,
      warnings: report.warnings,
    },
  };

  await mkdir(dirname(output), { recursive: true });
  const temporary = `${output}.tmp-${process.pid}`;
  await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  JSON.parse(await readFile(temporary, 'utf8'));
  await rename(temporary, output);

  console.log(`Imported ${report.records.length} portfolio record(s) from ${input}.`);
  console.log(`Validation: ${report.warnings.length} warning(s), ${report.conflicts.length} conflict(s), ${report.unknownColumns.length} unknown column(s), ${report.privateColumns.length} private-looking column(s).`);
  if (report.warnings.length || report.conflicts.length || report.privateColumns.length) process.exitCode = 2;
} catch (error) {
  console.error(`CSV import failed. Existing generated data was preserved.\n${error.message}`);
  process.exitCode = 1;
}
