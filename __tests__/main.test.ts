import {upload, parseUploadUrl} from '../src/upload-release-asset'

test('Upload Release Asset', async () => {
  const uploadReleaseAsset = jest.fn().mockReturnValue({
    data: {browser_download_url: 'http://example.com/download'}
  })

  const output = await upload({
    githubToken: 'very-secret',
    uploadUrl: 'http://example.com',
    assetPath: '__tests__/test/foo01.txt',
    assetName: 'foo01.txt',
    assetContentType: 'text/plain',
    overwrite: false,
    uploadReleaseAsset: uploadReleaseAsset
  })

  // TODO: fix me
  // expect(uploadReleaseAsset).toHaveBeenCalledWith({
  //   data: Buffer.from('foo\n'),
  //   headers: {
  //     'content-length': 4,
  //     'content-type': 'text/plain'
  //   },
  //   name: 'foo01.txt',
  //   url: 'http://example.com'
  // })

  expect(output.browser_download_url).toBe('http://example.com/download')
})

test('Upload Multiple Files', async () => {
  const uploadReleaseAsset = jest.fn().mockReturnValue({
    data: {browser_download_url: 'http://example.com/download'}
  })

  const output = await upload({
    githubToken: 'very-secret',
    uploadUrl: 'http://example.com',
    assetPath: '__tests__/test/foo0[123].txt',
    assetName: '',
    assetContentType: 'text/plain',
    overwrite: false,
    uploadReleaseAsset: uploadReleaseAsset
  })

  // TODO: fix me
  // expect(uploadReleaseAsset).toHaveBeenCalledWith({
  //   data: Buffer.from('foo\n'),
  //   headers: {
  //     'content-length': 4,
  //     'content-type': 'text/plain'
  //   },
  //   name: 'foo01.txt',
  //   url: 'http://example.com'
  // })
  // expect(uploadReleaseAsset).toHaveBeenCalledWith({
  //   data: Buffer.from('foo\n'),
  //   headers: {
  //     'content-length': 4,
  //     'content-type': 'text/plain'
  //   },
  //   name: 'foo02.txt',
  //   url: 'http://example.com'
  // })
  // expect(uploadReleaseAsset).toHaveBeenCalledWith({
  //   data: Buffer.from('foo\n'),
  //   headers: {
  //     'content-length': 4,
  //     'content-type': 'text/plain'
  //   },
  //   name: 'foo03.txt',
  //   url: 'http://example.com'
  // })

  expect(output.browser_download_url).toBe(
    'http://example.com/download\nhttp://example.com/download\nhttp://example.com/download'
  )
})

test('Guess Content Types', async () => {
  const uploadReleaseAsset = jest.fn().mockReturnValue({
    data: {browser_download_url: 'http://example.com/download'}
  })

  const output = await upload({
    githubToken: 'very-secret',
    uploadUrl: 'http://example.com',
    assetPath: '__tests__/test/bar.*',
    assetName: '',
    assetContentType: '',
    overwrite: false,
    uploadReleaseAsset: uploadReleaseAsset
  })

  // TODO: fix me
  // expect(uploadReleaseAsset).toHaveBeenCalledWith({
  //   data: Buffer.from('bar\n'),
  //   headers: {
  //     'content-length': 4,
  //     'content-type': 'image/jpeg'
  //   },
  //   name: 'bar.jpg',
  //   url: 'http://example.com'
  // })
  // expect(uploadReleaseAsset).toHaveBeenCalledWith({
  //   data: Buffer.from('bar\n'),
  //   headers: {
  //     'content-length': 4,
  //     'content-type': 'image/png'
  //   },
  //   name: 'bar.png',
  //   url: 'http://example.com'
  // })
  // expect(uploadReleaseAsset).toHaveBeenCalledWith({
  //   data: Buffer.from('bar\n'),
  //   headers: {
  //     'content-length': 4,
  //     'content-type': 'application/zip'
  //   },
  //   name: 'bar.zip',
  //   url: 'http://example.com'
  // })

  expect(output.browser_download_url).toBe(
    'http://example.com/download\nhttp://example.com/download\nhttp://example.com/download'
  )
})

test('parseUploadUrl', () => {
  const release = parseUploadUrl(
    'https://example.com/repos/shogo82148/github-action-test/releases/23245222/assets'
  )
  expect(release.owner).toBe('shogo82148')
  expect(release.repo).toBe('github-action-test')
  expect(release.releaseId).toBe('23245222')
})
