import * as core from '@actions/core'
import * as glob from '@actions/glob'
import * as fs from 'fs'
import * as path from 'path'
import Octokit from '@octokit/rest'
import * as mime from 'mime-types'

interface Options {
  github: GitHub
  upload_url: string
  asset_path: string
  asset_name: string
  asset_content_type: string
}

interface GitHub {
  repos: GitHubRepos
}

interface Response<T> {
  data: T
}
interface ReposUploadReleaseAssetResponse {
  value: ReposUploadReleaseAssetResponseValue
}
interface ReposUploadReleaseAssetResponseValue {
  browser_download_url: string
}
interface GitHubRepos {
  uploadReleaseAsset: (
    params?: Octokit.ReposUploadReleaseAssetParams
  ) => Promise<Response<ReposUploadReleaseAssetResponse>>
}

interface Outputs {
  browser_download_url: string
}

export async function upload(opts: Options): Promise<Outputs> {
  const github = opts.github
  const globber = await glob.create(opts.asset_path)
  const files = await globber.glob()

  if (files.length > 1 && opts.asset_name !== '') {
    throw new Error(
      'validation error, cannot upload multiple files with asset_name option'
    )
  }

  files.forEach(async file => {
    const name = opts.asset_name !== '' ? opts.asset_name : path.basename(file)
    const content_type =
      opts.asset_content_type !== ''
        ? opts.asset_content_type
        : mime.lookup(file) || 'application/octet-stream'
    const stat = fs.statSync(file)
    core.info(`uploading ${file} as ${name}: size: ${stat.size}`)
    const response = await github.repos.uploadReleaseAsset({
      url: opts.upload_url,
      headers: {
        'content-type': content_type,
        'content-length': stat.size
      },
      name: name,
      file: fs.readFileSync(file)
    })
    core.debug(JSON.stringify(response))
    return //response.data.value.browser_download_url
  })
  return {
    browser_download_url: ''
  }
}
