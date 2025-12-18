import { http, HttpResponse, delay } from 'msw'

const mockDocuments = [
  { id: 101, title: 'เอกสารขอเบิกงบ (A)', status: 'pending' },
  { id: 102, title: 'เอกสารลาพักร้อน (B)', status: 'approved' },
  { id: 103, title: 'เอกสารจัดซื้อ (C)', status: 'rejected' },
];

export const handlers = [
  http.get('*documents', async () => {
    await delay(50)
    return HttpResponse.json(mockDocuments) 
  }),

  http.post('*', async () => {
    await delay(50)
    return HttpResponse.json({ message: 'Success' })
  }),
]