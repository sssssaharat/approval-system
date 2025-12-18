import { vi, test, expect } from 'vitest'

const mocks = vi.hoisted(() => ({
  get: vi.fn().mockResolvedValue({ data: [] }),
}))

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        get: mocks.get,
      })),
    },
  }
})

import { fetchDocuments } from '../../api/documentApi'

test('fetchDocuments calls correct endpoint', async () => {
  await fetchDocuments()

  expect(mocks.get).toHaveBeenCalledWith('/documents')
})