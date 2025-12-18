import { fetchDocuments } from '../../api/documentApi'
import axios from 'axios'
import { vi, test, expect } from 'vitest'

vi.mock('axios')

test('fetchDocuments calls correct endpoint', async () => {
  axios.create.mockReturnThis()
  axios.get.mockResolvedValue({ data: [] })

  await fetchDocuments()

  expect(axios.get).toHaveBeenCalledWith('/documents')
})
