import {
  upload,
  parseUploadUrl,
  canonicalName
} from '../src/upload-release-asset'

test('Upload Release Asset', async () => {
  const uploadUrl =
    'https://example.com/repos/shogo82148/github-action-test/releases/23245222/assets'
  const uploadReleaseAsset = jest.fn().mockReturnValue({
    data: {browser_download_url: 'http://example.com/download'}
  })
  const getRelease = jest.fn().mockReturnValue({
    data: {
      upload_url: uploadUrl,
      assets: []
    }
  })

  const output = await upload({
    githubToken: 'very-secret',
    uploadUrl: uploadUrl,
    assetPath: '__tests__/test/foo01.txt',
    assetName: 'foo01.txt',
    assetContentType: 'text/plain',
    overwrite: false,
    uploadReleaseAsset: uploadReleaseAsset,
    getRelease: getRelease
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

  expect(uploadReleaseAsset).toBeCalledTimes(1)
  expect(output.browser_download_url).toBe('http://example.com/download')
})

test('Upload Multiple Files', async () => {
  const uploadUrl =
    'https://example.com/repos/shogo82148/github-action-test/releases/23245222/assets'
  const uploadReleaseAsset = jest.fn().mockReturnValue({
    data: {browser_download_url: 'http://example.com/download'}
  })
  const getRelease = jest.fn().mockReturnValue({
    data: {
      upload_url: uploadUrl,
      assets: []
    }
  })

  const output = await upload({
    githubToken: 'very-secret',
    uploadUrl: uploadUrl,
    assetPath: '__tests__/test/foo0[123].txt',
    assetName: '',
    assetContentType: 'text/plain',
    overwrite: false,
    uploadReleaseAsset: uploadReleaseAsset,
    getRelease: getRelease
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
  expect(uploadReleaseAsset).toBeCalledTimes(3)
  expect(output.browser_download_url).toBe(
    'http://example.com/download\nhttp://example.com/download\nhttp://example.com/download'
  )
})

test('Guess Content Types', async () => {
  const uploadUrl =
    'https://example.com/repos/shogo82148/github-action-test/releases/23245222/assets'
  const uploadReleaseAsset = jest.fn().mockReturnValue({
    data: {browser_download_url: 'http://example.com/download'}
  })
  const getRelease = jest.fn().mockReturnValue({
    data: {
      upload_url: uploadUrl,
      assets: []
    }
  })

  const output = await upload({
    githubToken: 'very-secret',
    uploadUrl: uploadUrl,
    assetPath: '__tests__/test/bar.*',
    assetName: '',
    assetContentType: '',
    overwrite: false,
    uploadReleaseAsset: uploadReleaseAsset,
    getRelease: getRelease
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
  expect(uploadReleaseAsset).toBeCalledTimes(3)
  expect(output.browser_download_url).toBe(
    'http://example.com/download\nhttp://example.com/download\nhttp://example.com/download'
  )
})

test('Guess Content Types', async () => {
  const uploadUrl =
    'https://example.com/repos/shogo82148/github-action-test/releases/23245222/assets'
  const uploadReleaseAsset = jest.fn().mockReturnValue({
    data: {browser_download_url: 'http://example.com/download'}
  })
  const getRelease = jest.fn().mockReturnValue({
    data: {
      upload_url: uploadUrl,
      assets: []
    }
  })

  const output = await upload({
    githubToken: 'very-secret',
    uploadUrl: uploadUrl,
    assetPath: '__tests__/test/bar.*',
    assetName: '',
    assetContentType: '',
    overwrite: false,
    uploadReleaseAsset: uploadReleaseAsset,
    getRelease: getRelease
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
  expect(uploadReleaseAsset).toBeCalledTimes(3)
  expect(output.browser_download_url).toBe(
    'http://example.com/download\nhttp://example.com/download\nhttp://example.com/download'
  )
})

test('duplicated file names', async () => {
  const uploadUrl =
    'https://example.com/repos/shogo82148/github-action-test/releases/23245222/assets'
  const uploadReleaseAsset = jest.fn().mockReturnValue({
    data: {browser_download_url: 'http://example.com/download'}
  })
  const getRelease = jest.fn().mockReturnValue({
    data: {
      upload_url: uploadUrl,
      assets: []
    }
  })

  await expect(
    async () =>
      await upload({
        githubToken: 'very-secret',
        uploadUrl: uploadUrl,
        assetPath: '__tests__/test/duplications/**',
        assetName: '',
        assetContentType: '',
        overwrite: false,
        uploadReleaseAsset: uploadReleaseAsset,
        getRelease: getRelease
      })
  ).rejects.toThrow(/validation error/)
  expect(uploadReleaseAsset).not.toBeCalled()
})

test('uploading files already exists', async () => {
  const uploadUrl =
    'https://example.com/repos/shogo82148/github-action-test/releases/23245222/assets'
  const uploadReleaseAsset = jest.fn().mockReturnValue({
    data: {browser_download_url: 'http://example.com/download'}
  })
  const getRelease = jest.fn().mockReturnValue({
    data: {
      upload_url: uploadUrl,
      assets: [
        {
          id: '1234',
          url: 'http://example.com/download',
          name: 'foo01.txt'
        }
      ]
    }
  })

  await expect(
    async () =>
      await upload({
        githubToken: 'very-secret',
        uploadUrl: uploadUrl,
        assetPath: '__tests__/test/foo01.txt',
        assetName: '',
        assetContentType: '',
        overwrite: false,
        uploadReleaseAsset: uploadReleaseAsset,
        getRelease: getRelease
      })
  ).rejects.toThrow(/validation error/)
  expect(uploadReleaseAsset).not.toBeCalled()
})

test('overwrite', async () => {
  const uploadUrl =
    'https://example.com/repos/shogo82148/github-action-test/releases/23245222/assets'
  const uploadReleaseAsset = jest.fn().mockReturnValue({
    data: {browser_download_url: 'http://example.com/download'}
  })
  const getRelease = jest.fn().mockReturnValue({
    data: {
      upload_url: uploadUrl,
      assets: [
        {
          id: '1234',
          url: 'http://example.com/download',
          name: 'foo01.txt'
        }
      ]
    }
  })
  const deleteReleaseAsset = jest.fn()

  await upload({
    githubToken: 'very-secret',
    uploadUrl: uploadUrl,
    assetPath: '__tests__/test/foo01.txt',
    assetName: '',
    assetContentType: '',
    overwrite: true,
    uploadReleaseAsset: uploadReleaseAsset,
    getRelease: getRelease,
    deleteReleaseAsset: deleteReleaseAsset
  })
  expect(deleteReleaseAsset).toBeCalledWith({
    url: 'http://example.com/download',
    githubToken: 'very-secret'
  })
  expect(uploadReleaseAsset).toBeCalledTimes(1)
})

test('parseUploadUrl', () => {
  const release = parseUploadUrl(
    'https://example.com/repos/shogo82148/github-action-test/releases/23245222/assets'
  )
  expect(release.owner).toBe('shogo82148')
  expect(release.repo).toBe('github-action-test')
  expect(release.releaseId).toBe('23245222')
})

test('canonicalName', () => {
  expect(canonicalName('foo.txt')).toBe('foo.txt')
  expect(canonicalName('foo')).toBe('foo')
  expect(canonicalName('foo.')).toBe('default.foo')
  expect(canonicalName('foo..')).toBe('default.foo')
  expect(canonicalName('.foo')).toBe('default.foo')
  expect(canonicalName('..foo')).toBe('default.foo')
  expect(canonicalName('.foo.')).toBe('default.foo')
  expect(canonicalName('foo.txt.')).toBe('foo.txt')
  expect(canonicalName('.foo.txt')).toBe('default.foo.txt')
  expect(canonicalName('.foo.txt.')).toBe('default.foo.txt')
  expect(canonicalName('foo...txt')).toBe('foo.txt')
  expect(canonicalName(' !"#$%&\'()*+,-.txt')).toBe('+.-.txt')
  expect(canonicalName('foo/bar.txt')).toBe('foo.bar.txt')
  expect(canonicalName(':;<=>?@.txt')).toBe('@.txt')
  expect(canonicalName('[\\]^_`{|}~.txt')).toBe('_.txt')
  expect(canonicalName('あab.txt')).toBe('ab.txt')
})
