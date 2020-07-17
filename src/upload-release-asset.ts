import * as fs from 'fs'
import * as stream from 'stream'
import * as path from 'path'
import * as url from 'url'
import * as core from '@actions/core'
import * as glob from '@actions/glob'
import * as http from '@actions/http-client'
import * as mime from 'mime-types'

interface Options {
  githubToken: string
  uploadUrl: string
  assetPath: string
  assetName: string
  assetContentType: string
  overwrite: boolean
  uploadReleaseAsset?: (
    params: ReposUploadReleaseAssetParams
  ) => Promise<Response<ReposUploadReleaseAssetResponse>>
}

interface Response<T> {
  data: T
}

interface ReposUploadReleaseAssetResponse {
  browser_download_url: string
}

interface ReposUploadReleaseAssetParams {
  url: string
  headers: {[key: string]: any}
  name: string
  data: stream.Readable
  githubToken: string
}

interface Outputs {
  browser_download_url: string
}

const uploadReleaseAsset = async (
  params: ReposUploadReleaseAssetParams
): Promise<Response<ReposUploadReleaseAssetResponse>> => {
  const client = new http.HttpClient(
    'shogo82148-actions-upload-release-asset/v1',
    [],
    {
      headers: {
        Authorization: `token ${params.githubToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    }
  )
  let rawurl = params.url
  rawurl = rawurl.replace(/[{][^}]*[}]$/, '')
  const u = new url.URL(rawurl)
  if (params.name) {
    u.searchParams.append('name', params.name)
  }
  const resp = await client.request(
    'POST',
    u.toString(),
    params.data,
    params.headers
  )
  const statusCode = resp.message.statusCode
  const contents = await resp.readBody()
  if (statusCode !== 201) {
    throw new Error(`unexpected status code: ${statusCode}\n${contents}`)
  }
  return {
    data: JSON.parse(contents) as ReposUploadReleaseAssetResponse
  }
}

export async function upload(opts: Options): Promise<Outputs> {
  const uploader = opts.uploadReleaseAsset || uploadReleaseAsset
  const globber = await glob.create(opts.assetPath)
  const files = await globber.glob()

  if (files.length > 1 && opts.assetName !== '') {
    throw new Error(
      'validation error, cannot upload multiple files with asset_name option'
    )
  }

  const urls = await Promise.all(
    files.map(async file => {
      const name = opts.assetName || path.basename(file)
      const content_type =
        opts.assetContentType || mime.lookup(file) || 'application/octet-stream'
      const stat = fs.statSync(file)
      core.info(`uploading ${file} as ${name}: size: ${stat.size}`)
      const response = await uploader({
        githubToken: opts.githubToken,
        url: opts.uploadUrl,
        headers: {
          'content-type': content_type,
          'content-length': stat.size
        },
        name: name,
        data: fs.createReadStream(file)
      })
      core.debug(JSON.stringify(response))
      return response.data.browser_download_url
    })
  )
  return {
    browser_download_url: urls.join('\n')
  }
}
