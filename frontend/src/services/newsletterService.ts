import { api } from './api'

export type NewsletterSubscribeResponse = {
  ok: true
  alreadySubscribed: boolean
}

export async function subscribeNewsletter(
  email: string,
  source = 'modal_v1',
): Promise<NewsletterSubscribeResponse> {
  return api.post<NewsletterSubscribeResponse>('/newsletter/subscribe', {
    email,
    source,
  })
}
