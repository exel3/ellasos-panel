export default async function ({ store, redirect, req, res, app }) {
  // req.url

  if (!app.context.route.path.startsWith('/password/') && !app.context.route.path.startsWith('/email/') && !app.context.route.path.startsWith('/adminemail/') && !app.context.route.path.startsWith('/adminpassword/')) {
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
