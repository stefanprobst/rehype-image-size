import * as path from 'path'
import { fileURLToPath } from 'url'
import { unified } from 'unified'
import fromMarkdown from 'remark-parse'
import toHast from 'remark-rehype'
import toHtml from 'rehype-stringify'
import { VFile } from 'vfile'
import { test } from 'uvu'
import * as assert from 'uvu/assert'
import withImageSize from '../src/index.js'

function createProcessor(options) {
  const processor = unified().use(fromMarkdown).use(toHast).use(withImageSize, options).use(toHtml)
  return processor
}

test('add width and height attributes to image element with relative path in src attribute', async () => {
  const doc = new VFile({
    value: `![Test](./__fixtures__/test.svg)`,
    path: fileURLToPath(import.meta.url),
  })

  const file = createProcessor().processSync(doc)

  assert.is(
    String(file),
    `<p><img src="./__fixtures__/test.svg" alt="Test" width="100" height="100"></p>`,
  )
})

test('add width and height attributes to image element with absolute path in src attribute', async () => {
  const doc = new VFile({
    value: `![Test](/test.svg)`,
    path: fileURLToPath(import.meta.url),
  })

  const file = createProcessor().processSync(doc)

  assert.is(String(file), `<p><img src="/test.svg" alt="Test" width="100" height="100"></p>`)
})

test('handles custom public folder', async () => {
  const doc = new VFile({
    value: `![Test](/test.svg)`,
    path: fileURLToPath(import.meta.url),
  })

  const file = createProcessor({
    publicFolder: path.join(process.cwd(), 'test', '__fixtures__', 'public'),
  }).processSync(doc)

  assert.is(String(file), `<p><img src="/test.svg" alt="Test" width="100" height="100"></p>`)
})

test('skips image elements with url in src attribute', async () => {
  const doc = new VFile({
    value: `![Test](https://example.com/test.svg)`,
    path: fileURLToPath(import.meta.url),
  })

  const file = createProcessor().processSync(doc)

  assert.is(String(file), `<p><img src="https://example.com/test.svg" alt="Test"></p>`)
})

test.run()
