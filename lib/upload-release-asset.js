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
const glob = __importStar(require("@actions/glob"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const mime = __importStar(require("mime-types"));
function upload(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const github = opts.github;
        const globber = yield glob.create(opts.asset_path);
        const files = yield globber.glob();
        if (files.length > 1 && opts.asset_name !== '') {
            throw new Error('validation error, cannot upload multiple files with asset_name option');
        }
        const urls = yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
            const name = opts.asset_name !== '' ? opts.asset_name : path.basename(file);
            const content_type = opts.asset_content_type !== ''
                ? opts.asset_content_type
                : mime.lookup(file) || 'application/octet-stream';
            const stat = fs.statSync(file);
            core.info(`uploading ${file} as ${name}: size: ${stat.size}`);
            const response = yield github.repos.uploadReleaseAsset({
                url: opts.upload_url,
                headers: {
                    'content-type': content_type,
                    'content-length': stat.size
                },
                name: name,
                file: fs.readFileSync(file)
            });
            core.debug(JSON.stringify(response));
            return response.data.value.browser_download_url;
        })));
        return {
            browser_download_url: urls.join('\n')
        };
    });
}
exports.upload = upload;
