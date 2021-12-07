export default async function ({ store, redirect, req, res, app }) {
  // req.url
  let withSlash = false
  if (app.context.route.path.startsWith('/password/')) {
    const text = app.context.route.path.slice(10)
    if (text.includes('/')) { withSlash = true }
  }
  if (!app.context.route.path.startsWith('/password/') && !withSlash) {
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
