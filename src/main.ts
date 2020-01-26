import * as core from '@actions/core'
import {upload} from './upload-release-asset'

async function run(): Promise<void> {
  try {
    const github_token = core.getInput('github_token', {required: true})
    const upload_url = core.getInput('upload_url', {required: true})
    const asset_path = core.getInput('asset_path', {required: true})
    const asset_name = core.getInput('asset_name')
    const asset_content_type = core.getInput('asset_content_type')
    const output = await upload({
      github_token: github_token,
      upload_url: upload_url,
      asset_path: asset_path,
      asset_name: asset_name,
      asset_content_type: asset_content_type
    })
    core.setOutput('browser_download_url', output.browser_download_url)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
