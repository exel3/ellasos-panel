export default async function ({ store, redirect, req, res, app }) {
  try {
    await app.$axios.$get(
      '/api').then(token => {
      if (!token) {
        redirect({ name: 'auth' })
      }
    })
  } catch (e) { redirect({ name: 'auth' }) }
}
