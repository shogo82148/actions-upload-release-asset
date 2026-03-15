import * as core from "@actions/core";
import { upload } from "./upload-release-asset.js";
/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run() {
    try {
        const required = { required: true };
        const githubToken = core.getInput("github_token", required);
        const uploadUrl = core.getInput("upload_url", required);
        const assetPath = core.getInput("asset_path", required);
        const assetName = core.getInput("asset_name");
        const assetContentType = core.getInput("asset_content_type");
        const overwrite = core.getBooleanInput("overwrite", required);
        const output = await upload({
            githubToken,
            uploadUrl,
            assetPath,
            assetName,
            assetContentType,
            overwrite,
        });
        core.setOutput("browser_download_url", output.browser_download_url);
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error);
        }
        else {
            core.setFailed(`${error}`);
        }
    }
}
