import * as core from '@actions/core'
import * as glob from '@actions/glob'

interface Options {
  github_token: string
  upload_url: string
  asset_path: string
  asset_name: string
  asset_content_type: string
}

interface Outputs {
  browser_download_url: string
}

export async function upload(opts: Options): Promise<Outputs> {
  const globber = await glob.create(opts.asset_path)
  const files = await globber.glob()
  files.forEach(file => {
    core.debug(file)
  })
  return {
    browser_download_url: ''
  }
}
