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
  getRelease?: (
    params: ReposGetReleaseParams
  ) => Promise<Response<ReposGetReleaseResponse>>
  deleteReleaseAsset?: (params: ReposDeleteReleaseAssetParams) => Promise<void>
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

interface ReposDeleteReleaseAssetParams {
  owner: string
  repo: string
  assetId: string
  githubToken: string
}

const deleteReleaseAsset = async (
  params: ReposDeleteReleaseAssetParams
): Promise<void> => {
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
  const url = `https://api.github.com/repos/${params.owner}/${params.repo}/releases/assets/${params.assetId}`
  const resp = await client.request('DELETE', url, '', {})
  const statusCode = resp.message.statusCode
  const contents = await resp.readBody()
  if (statusCode !== 204) {
    throw new Error(`unexpected status code: ${statusCode}\n${contents}`)
  }
  return
}

interface ReposGetReleaseParams {
  owner: string
  repo: string
  releaseId: string
  githubToken: string
}

interface ReposGetReleaseResponse {
  upload_url: string
  assets: ReposGetReleaseAsset[]
}

// subset of Assets resources on GitHub
interface ReposGetReleaseAsset {
  url: string
  id: string
  name: string
}

// minium implementation of get a release API
// https://docs.github.com/en/rest/reference/repos#get-a-release
const getRelease = async (
  params: ReposGetReleaseParams
): Promise<Response<ReposGetReleaseResponse>> => {
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
  const url = `https://api.github.com/repos/${params.owner}/${params.repo}/releases/${params.releaseId}`
  const resp = await client.request('GET', url, '', {})
  const statusCode = resp.message.statusCode
  const contents = await resp.readBody()
  if (statusCode !== 200) {
    throw new Error(`unexpected status code: ${statusCode}\n${contents}`)
  }
  return {
    data: JSON.parse(contents) as ReposGetReleaseResponse
  }
}

export async function upload(opts: Options): Promise<Outputs> {
  const uploader = opts.uploadReleaseAsset || uploadReleaseAsset
  const globber = await glob.create(opts.assetPath)
  const files = await globber.glob()

  await validateFilenames(files, opts)

  const urls = await Promise.all(
    files.map(async file => {
      const name = canonicalName(opts.assetName || path.basename(file))
      const content_type =
        opts.assetContentType || mime.lookup(file) || 'application/octet-stream'
      const stat = await fsStats(file)
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

async function fsStats(file: string): Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, stats) => {
      if (err) {
        reject(err)
        return
      }
      resolve(stats)
    })
  })
}

async function validateFilenames(files: string[], opts: Options) {
  if (files.length > 1 && opts.assetName !== '') {
    throw new Error(
      'validation error: cannot upload multiple files with asset_name option'
    )
  }

  interface AssetOrFile {
    name: string
    asset?: ReposGetReleaseAsset
    files: string[]
  }

  // get assets already uploaded
  const assets: {[name: string]: AssetOrFile} = {}
  const getter = opts.getRelease || getRelease
  const {owner, repo, releaseId} = parseUploadUrl(opts.uploadUrl)
  const release = await getter({
    owner,
    repo,
    releaseId,
    githubToken: opts.githubToken
  })
  release.data.assets.forEach(asset => {
    assets[asset.name] = {
      name: asset.name,
      asset: asset,
      files: []
    }
  })

  // check duplications
  const duplications: AssetOrFile[] = []
  files.forEach(file => {
    const name = canonicalName(opts.assetName || path.basename(file))
    const asset = assets[name]
    if (asset) {
      duplications.push(asset)
      asset.files.push(file)
    } else {
      assets[name] = {
        name,
        files: [file]
      }
    }
  })

  // report the result of validation
  let errorCount = 0
  duplications.forEach(item => {
    if (item.files.length <= 1) {
      return
    }
    core.error(
      `validation error: file name "${
        item.name
      }" is duplicated. (${item.files.join(', ')})`
    )
    errorCount++
  })

  // report the result of validation
  const deleteAssets = duplications
    .filter(item => {
      return item.files.length === 1 && item.asset
    })
    .map(item => item.asset!)
  if (!opts.overwrite) {
    deleteAssets.forEach(item => {
      core.error(`validation error: file name "${item.name}" already exists`)
      errorCount++
    })
  }
  if (errorCount > 0) {
    throw new Error('validation error')
  }

  if (!opts.overwrite || deleteAssets.length === 0) {
    return
  }
  const deleter = opts.deleteReleaseAsset || deleteReleaseAsset
  await Promise.all(
    deleteAssets.map(async asset => {
      core.info(`deleting asset ${asset.name} before uploading`)
      await deleter({
        owner,
        repo,
        assetId: asset.id,
        githubToken: opts.githubToken
      })
    })
  )
}

export function canonicalName(name: string): string {
  return name
}

interface Release {
  owner: string
  repo: string
  releaseId: string
}

const regexUploadUrl = new RegExp(
  '/repos/(?<owner>[^/]+)/(?<repo>[^/]+)/releases/(?<release_id>[0-9]+)/'
)
export function parseUploadUrl(rawurl: string): Release {
  const match = rawurl.match(regexUploadUrl)
  const groups = match?.groups
  if (!groups) {
    throw new Error(`failed to parse the upload url: ${rawurl}`)
  }
  return {
    owner: groups['owner'],
    repo: groups['repo'],
    releaseId: groups['release_id']
  }
}
