import type { Chat } from '../types/review'

export const initialChats: Chat[] = [
  {
    id: 'checkout-review',
    title: 'Checkout flow review',
    updatedAt: 'Today, 10:42',
    imageCount: 3,
  },
  {
    id: 'account-settings',
    title: 'Account settings audit',
    updatedAt: 'Yesterday',
    imageCount: 5,
  },
  {
    id: 'mobile-navigation',
    title: 'Mobile navigation',
    updatedAt: '22 Jul',
    imageCount: 2,
  },
  {
    id: 'empty-states',
    title: 'Empty states review',
    updatedAt: '18 Jul',
    imageCount: 4,
  },
]
