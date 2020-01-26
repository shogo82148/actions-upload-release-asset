import {upload} from '../src/upload-release-asset'

test('Upload Release Asset', async () => {
  const uploadReleaseAsset = jest.fn().mockReturnValue({
    data: {browser_download_url: 'http://example.com/download'}
  })
  const github = {
    repos: {
      uploadReleaseAsset
    }
  }

  await upload({
    github: github,
    upload_url: 'http://example.com',
    asset_path: '__tests__/test/foo01.txt',
    asset_name: 'foo01.txt',
    asset_content_type: 'text/plain'
  })

  expect(uploadReleaseAsset).toHaveBeenCalledWith({
    file: Buffer.from('foo\n'),
    headers: {
      'content-length': 4,
      'content-type': 'application/octet-stream'
    },
    name: 'foo01.txt',
    url: 'http://example.com'
  })
})

test('Upload Multiple Files', async () => {
  const uploadReleaseAsset = jest.fn().mockReturnValue({
    data: {value: {browser_download_url: 'http://example.com/download'}}
  })
  const github = {
    repos: {
      uploadReleaseAsset
    }
  }

  await upload({
    github: github,
    upload_url: 'http://example.com',
    asset_path: '__tests__/test/foo0[123].txt',
    asset_name: '',
    asset_content_type: 'text/plain'
  })

  expect(uploadReleaseAsset).toHaveBeenCalledWith({
    file: Buffer.from('foo\n'),
    headers: {
      'content-length': 4,
      'content-type': 'application/octet-stream'
    },
    name: 'foo01.txt',
    url: 'http://example.com'
  })
  expect(uploadReleaseAsset).toHaveBeenCalledWith({
    file: Buffer.from('foo\n'),
    headers: {
      'content-length': 4,
      'content-type': 'application/octet-stream'
    },
    name: 'foo02.txt',
    url: 'http://example.com'
  })
  expect(uploadReleaseAsset).toHaveBeenCalledWith({
    file: Buffer.from('foo\n'),
    headers: {
      'content-length': 4,
      'content-type': 'application/octet-stream'
    },
    name: 'foo03.txt',
    url: 'http://example.com'
  })
})
