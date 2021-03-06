import getBlobDuration from '../src/getBlobDuration'

let dummyVideoEl, mockBlob

beforeEach(() => {
  dummyVideoEl = jest.fn()

  dummyVideoEl.addEventListener = jest.fn((eventName, handler) => {
    expect(eventName).toBe('loadedmetadata')
    handler()
  })

  document.createElement = jest.fn(elType => {
    expect(elType).toBe('video')
    return dummyVideoEl
  })

  window.URL.createObjectURL = jest.fn()

  mockBlob = jest.fn()
})

it('should handle ordinary duration retrieval', async () => {
  dummyVideoEl.duration = 23741

  const duration = await getBlobDuration(mockBlob)
  expect(duration).toBe(23741)

  expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob)
})

it('should execute Chrome bugfix duration retrieval as needed', async () => {
  dummyVideoEl.duration = Infinity

  const durationP = getBlobDuration(mockBlob)
  await new Promise(async resolve => {
    dummyVideoEl.duration = 98543
    dummyVideoEl.ontimeupdate()
    const duration = await durationP
    expect(duration).toBe(98543)
    resolve()
  })
})