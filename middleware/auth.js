export default async function ({ store, redirect, req, res, app }) {
  if (!req.url.startsWith('/password/')) {
    try {
      await app.$axios.$get(
        '/api').then(token => {
        if (!token) {
          redirect({ name: 'auth' })
        }
      })
    } catch (e) { redirect({ name: 'auth' }) }
  }
}
