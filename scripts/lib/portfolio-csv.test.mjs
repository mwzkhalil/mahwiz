import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePortfolioCsv } from './portfolio-csv.mjs';

test('maps aliases, quoted commas, multiline Unicode, booleans, and tags', () => {
  const csv = `category,position,institution,from,to,details,website,highlight,topics
experience,"Researcher, NLP",Example Lab,2024,present,"Urdu تحقیق\nSecond line",https://example.test,yes,"urdu|speech"`;
  const result = parsePortfolioCsv(csv);

  assert.equal(result.records.length, 1);
  assert.deepEqual(result.records[0], {
    section: 'experience',
    title: 'Researcher, NLP',
    organization: 'Example Lab',
    startDate: '2024',
    endDate: 'present',
    description: 'Urdu تحقیق\nSecond line',
    url: 'https://example.test',
    featured: true,
    tags: ['urdu', 'speech'],
  });
  assert.deepEqual(result.warnings, []);
});

test('reports malformed rows, missing values, unknown and private-looking columns', () => {
  const csv = `section,title,start_date,secret_token,mystery
experience,,Spring 2024,do-not-publish,value
"publication,"Broken row,2024,hidden,value`;
  const result = parsePortfolioCsv(csv);

  assert.deepEqual(result.privateColumns, ['secret_token']);
  assert.deepEqual(result.unknownColumns, ['secret_token', 'mystery']);
  assert.ok(result.warnings.some((warning) => warning.code === 'MissingTitle' && warning.row === 2));
  assert.ok(result.warnings.some((warning) => warning.code === 'InvalidDate' && warning.row === 2));
  assert.ok(result.warnings.some((warning) => warning.code === 'MissingQuotes'));
  assert.equal(Object.hasOwn(result.records[0], 'secret_token'), false);
});

test('reports conflicting records without discarding either row', () => {
  const csv = `section,title,organization,start,description
experience,Engineer,Example,2024,First version
experience,Engineer,Example,2024,Conflicting version`;
  const result = parsePortfolioCsv(csv);

  assert.equal(result.records.length, 2);
  assert.equal(result.conflicts.length, 1);
  assert.deepEqual(result.conflicts[0].rows, [2, 3]);
});
