import * as core from '@actions/core'
import {upload} from './upload-release-asset'

async function run(): Promise<void> {
  try {
    const githubToken = core.getInput('github_token', {required: true})
    const uploadUrl = core.getInput('upload_url', {required: true})
    const assetPath = core.getInput('asset_path', {required: true})
    const assetName = core.getInput('asset_name')
    const assetContentType = core.getInput('asset_content_type')

    const output = await upload({
      githubToken,
      uploadUrl,
      assetPath,
      assetName,
      assetContentType
    })
    core.setOutput('browser_download_url', output.browser_download_url)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
