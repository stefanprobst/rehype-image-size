// @ts-check

import { imageSize } from 'image-size'
import * as path from 'path'
import { visit } from 'unist-util-visit'
import { isAbsoluteUrl as isUrl } from '@stefanprobst/is-absolute-url'

/** @typedef {import('.').Options} Options */
/** @typedef {import('hast').Root} Root */
/** @typedef {import('hast').Element} Element */

/** @type {import('unified').Plugin<[Options?], Root>} */
export default function attacher(options) {
  const publicFolder = options?.publicFolder ?? path.join(process.cwd(), 'public')

  /** @type {Transformer<Root>} */
  return function transformer(tree, file) {
    visit(tree, { type: 'element', tagName: 'img' }, onImage)

    /** @type {(node: Element) => void} */
    function onImage(node) {
      if (typeof node.properties?.src !== 'string') return
      if (isUrl(node.properties.src)) return

      const filePath = path.join(
        path.isAbsolute(node.properties.src) ? publicFolder : file.dirname,
        node.properties.src,
      )

      const { width, height } = imageSize(filePath)
      node.properties.width = width
      node.properties.height = height
    }
  }
}
