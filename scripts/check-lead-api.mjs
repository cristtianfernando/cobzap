import assert from 'node:assert/strict';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

const missingOrigin = await fetch(`${baseUrl}/api/salvar_lead`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: '{}',
});
const foreignOrigin = await fetch(`${baseUrl}/api/salvar_lead`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: 'https://example.com' },
  body: '{}',
});

assert.equal(missingOrigin.status, 403);
assert.equal(foreignOrigin.status, 403);
console.log('API de leads bloqueou origem não autorizada.');
