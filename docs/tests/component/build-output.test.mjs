import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

Deno.test('vitepress config exists', () => {
  const configPath = resolve(Deno.cwd(), 'docs/.vitepress/config.mts')
  assert.ok(existsSync(configPath), 'config.mts should exist')
  const content = readFileSync(configPath, 'utf8')
  assert.ok(content.includes('defineConfig'), 'should have defineConfig')
})

Deno.test('site-meta.mjs exports createSiteMeta', () => {
  const metaPath = resolve(Deno.cwd(), 'docs/.vitepress/site-meta.mjs')
  assert.ok(existsSync(metaPath), 'site-meta.mjs should exist')
  const content = readFileSync(metaPath, 'utf8')
  assert.ok(content.includes('createSiteMeta'), 'should export createSiteMeta')
})
