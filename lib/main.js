"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const upload_release_asset_1 = require("./upload-release-asset");
const github_1 = require("@actions/github");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const github_token = core.getInput('github_token', { required: true });
            const upload_url = core.getInput('upload_url', { required: true });
            const asset_path = core.getInput('asset_path', { required: true });
            const asset_name = core.getInput('asset_name');
            const asset_content_type = core.getInput('asset_content_type');
            const github = new github_1.GitHub(github_token);
            const output = yield upload_release_asset_1.upload({
                github,
                upload_url,
                asset_path,
                asset_name,
                asset_content_type
            });
            core.setOutput('browser_download_url', output.browser_download_url);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
