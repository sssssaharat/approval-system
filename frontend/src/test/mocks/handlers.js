import { rest } from 'msw'

export const handlers = [
  rest.get('http://localhost:8080/api/documents', (_, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, title: 'Doc A', status: 'pending', action_reason: '' },
        { id: 2, title: 'Doc B', status: 'approved', action_reason: 'ok' },
        { id: 3, title: 'Doc C', status: 'rejected', action_reason: 'no' },
      ])
    )
  }),

  rest.put('http://localhost:8080/api/documents/approve', (_, res, ctx) => {
    return res(ctx.json({ updated: 1 }))
  }),

  rest.put('http://localhost:8080/api/documents/reject', (_, res, ctx) => {
    return res(ctx.json({ updated: 1 }))
  }),
]
