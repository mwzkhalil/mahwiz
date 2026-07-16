import Papa from 'papaparse';

export const FIELD_ALIASES = {
  section: ['section', 'category', 'group'],
  type: ['type', 'record_type', 'role_type'],
  title: ['title', 'name', 'role', 'position'],
  organization: ['organization', 'company', 'institution', 'employer'],
  location: ['location', 'place'],
  startDate: ['startdate', 'start_date', 'start', 'from'],
  endDate: ['enddate', 'end_date', 'end', 'to'],
  year: ['year'],
  description: ['description', 'details', 'summary', 'bio'],
  url: ['url', 'link', 'website'],
  secondaryUrl: ['secondaryurl', 'secondary_url', 'secondary_link'],
  authors: ['authors', 'author'],
  venue: ['venue', 'conference', 'journal'],
  amount: ['amount', 'value'],
  status: ['status'],
  image: ['image', 'figure', 'asset'],
  featured: ['featured', 'highlight'],
  order: ['order', 'sort_order', 'sort'],
  tags: ['tags', 'topics', 'keywords'],
};

const SECTIONS = new Set(['profile', 'education', 'experience', 'publication', 'grant', 'award', 'talk', 'project', 'collaborator', 'link', 'hobby']);
const PRIVATE_PATTERN = /(^|_)(password|secret|token|private|salary|phone|address|dob|birth|ssn|cnic|passport|credential|api_?key)($|_)/iu;
const DATE_PATTERN = /^(?:\d{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?)?|present|current)$/iu;

function key(value) {
  return String(value ?? '').trim().toLowerCase().replace(/[\s-]+/gu, '_');
}

function clean(value) {
  const result = String(value ?? '').trim();
  return result || undefined;
}

function parseBoolean(value) {
  if (value === undefined) return undefined;
  const normalized = key(value);
  if (['yes', 'true', '1', 'featured', 'highlighted'].includes(normalized)) return true;
  if (['no', 'false', '0'].includes(normalized)) return false;
  return null;
}

function parseTags(value) {
  if (!value) return undefined;
  const delimiter = value.includes('|') ? '|' : value.includes(';') ? ';' : ',';
  const tags = [...new Set(value.split(delimiter).map((tag) => tag.trim()).filter(Boolean))];
  return tags.length ? tags : undefined;
}

export function parsePortfolioCsv(source) {
  const parsed = Papa.parse(source, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: key,
  });
  const headers = parsed.meta.fields ?? [];
  const aliasLookup = new Map();
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    for (const alias of aliases) aliasLookup.set(key(alias), field);
  }

  const unknownColumns = headers.filter((header) => !aliasLookup.has(header));
  const privateColumns = headers.filter((header) => PRIVATE_PATTERN.test(header));
  const warnings = parsed.errors.map((error) => ({
    row: (error.row ?? 0) + 2,
    code: error.code,
    message: error.message,
  }));
  const records = [];

  parsed.data.forEach((raw, index) => {
    const row = index + 2;
    const record = {};
    for (const [column, value] of Object.entries(raw)) {
      const field = aliasLookup.get(column);
      if (field && !privateColumns.includes(column)) record[field] = clean(value);
    }

    if (!record.section) warnings.push({ row, code: 'MissingSection', message: 'Required section is missing.' });
    else {
      record.section = key(record.section);
      if (!SECTIONS.has(record.section)) warnings.push({ row, code: 'UnknownSection', message: `Unrecognized section “${record.section}”.` });
    }
    if (!record.title) warnings.push({ row, code: 'MissingTitle', message: 'Required title is missing.' });

    for (const field of ['startDate', 'endDate']) {
      if (record[field] && !DATE_PATTERN.test(record[field])) {
        warnings.push({ row, code: 'InvalidDate', message: `${field} “${record[field]}” was preserved but is not a supported date format.` });
      }
    }

    if (record.featured !== undefined) {
      const featured = parseBoolean(record.featured);
      if (featured === null) warnings.push({ row, code: 'InvalidBoolean', message: `featured value “${record.featured}” was not recognized.` });
      else record.featured = featured;
    }
    if (record.order !== undefined) {
      const order = Number(record.order);
      if (Number.isFinite(order)) record.order = order;
      else warnings.push({ row, code: 'InvalidOrder', message: `order value “${record.order}” is not numeric.` });
    }
    record.tags = parseTags(record.tags);
    records.push(record);
  });

  const conflicts = [];
  const identities = new Map();
  records.forEach((record, index) => {
    const identity = [record.section, record.type, record.title, record.organization, record.startDate].map(key).join('|');
    if (!identities.has(identity)) identities.set(identity, index);
    else if (JSON.stringify(records[identities.get(identity)]) !== JSON.stringify(record)) {
      conflicts.push({ rows: [identities.get(identity) + 2, index + 2], identity, message: 'Records share an identity but contain conflicting values.' });
    }
  });

  return { records, unknownColumns, privateColumns, conflicts, warnings };
}
