import * as core from '@actions/core'
import * as glob from '@actions/glob'
import * as fs from 'fs'
import Octokit from '@octokit/rest'

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
  files.forEach(async file => {
    core.debug(`uploading ${file}`)
    const stat = fs.statSync(file)
    const response = await github.repos.uploadReleaseAsset({
      url: opts.upload_url,
      headers: {
        'content-type': 'application/octet-stream', // TODO: see asset_content_type
        'content-length': stat.size
      },
      name: opts.asset_name, // TODO: multiple asset names
      file: fs.readFileSync(file)
    })
    return response.data.value.browser_download_url
  })
  return {
    browser_download_url: ''
  }
}
