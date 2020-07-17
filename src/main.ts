import * as core from '@actions/core'
import {upload} from './upload-release-asset'

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github_token', {required: true})
    const uploadUrl = core.getInput('upload_url', {required: true})
    const assetPath = core.getInput('asset_path', {required: true})
    const assetName = core.getInput('asset_name')
    const assetContentType = core.getInput('asset_content_type')
    const overwrite = parseBoolean(core.getInput('overwrite'))

    const output = await upload({
      githubToken,
      uploadUrl,
      assetPath,
      assetName,
      assetContentType,
      overwrite
    })
    core.setOutput('browser_download_url', output.browser_download_url)
  } catch (error) {
    core.setFailed(error.message)
  }
}

function parseBoolean(s: string): boolean {
  // YAML 1.0 compatible boolean values
  switch (s) {
    case 'y':
    case 'Y':
    case 'yes':
    case 'Yes':
    case 'YES':
    case 'true':
    case 'True':
    case 'TRUE':
      return true
    case 'n':
    case 'N':
    case 'no':
    case 'No':
    case 'NO':
    case 'false':
    case 'False':
    case 'FALSE':
      return false
  }
  throw `invalid boolean value: ${s}`
}

run()
