import type { Plugin } from 'unified'
import type { Root } from 'hast'

export interface Options {
  publicFolder?: string
}

const withImageSize: Plugin<[Options?], Root>

export default withImageSize
