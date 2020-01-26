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
function upload(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const github = opts.github;
        const globber = yield glob.create(opts.asset_path);
        const files = yield globber.glob();
        files.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            core.debug(`uploading ${file}`);
            const stat = fs.statSync(file);
            const response = yield github.repos.uploadReleaseAsset({
                url: opts.upload_url,
                headers: {
                    'content-type': 'application/octet-stream',
                    'content-length': stat.size
                },
                name: opts.asset_name,
                file: fs.readFileSync(file)
            });
            return response.data.value.browser_download_url;
        }));
        return {
            browser_download_url: ''
        };
    });
}
exports.upload = upload;
