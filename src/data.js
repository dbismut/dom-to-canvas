import faker from 'faker'

export const imgs = [
  'https://images.unsplash.com/photo-1421790500381-fc9b5996f343?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
  'https://images.unsplash.com/photo-1536152470836-b943b246224c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1278&q=80',
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2253&q=80',
  'https://images.unsplash.com/photo-1545308562-050974fb9ac4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
  'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80'
]

export const names = Array(imgs.length)
  .fill(0)
  .map(faker.address.city)

// export const heights = Array(imgs.length)
//   .fill(0)
//   .map(() => 30 + ~~(Math.random() * 50))
