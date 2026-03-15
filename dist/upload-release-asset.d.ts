import * as stream from "stream";
interface Options {
    githubToken: string;
    uploadUrl: string;
    assetPath: string;
    assetName: string;
    assetContentType: string;
    overwrite: boolean;
    uploadReleaseAsset?: (params: ReposUploadReleaseAssetParams) => Promise<Response<ReposUploadReleaseAssetResponse>>;
    getRelease?: (params: ReposGetReleaseParams) => Promise<Response<ReposGetReleaseResponse>>;
    deleteReleaseAsset?: (params: ReposDeleteReleaseAssetParams) => Promise<void>;
}
interface Response<T> {
    data: T;
}
interface ReposUploadReleaseAssetResponse {
    browser_download_url: string;
}
interface ReposUploadReleaseAssetParams {
    url: string;
    headers: Record<string, number | string | string[]>;
    name: string;
    label?: string;
    data: stream.Readable;
    githubToken: string;
}
interface Outputs {
    browser_download_url: string;
}
interface ReposDeleteReleaseAssetParams {
    url: string;
    githubToken: string;
}
interface ReposGetReleaseParams {
    owner: string;
    repo: string;
    releaseId: string;
    githubToken: string;
}
interface ReposGetReleaseResponse {
    upload_url: string;
    assets: ReposGetReleaseAsset[];
}
interface ReposGetReleaseAsset {
    url: string;
    id: string;
    name: string;
}
export declare function upload(opts: Options): Promise<Outputs>;
export declare function canonicalName(name: string): string;
interface Release {
    owner: string;
    repo: string;
    releaseId: string;
}
export declare function parseUploadUrl(rawurl: string): Release;
export declare function getApiBaseUrl(): string;
export {};
