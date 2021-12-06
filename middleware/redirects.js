export default function (req) {
  const redirects = [
    {
      from: '/',
      to: '/buttons'
    }
  ]
  const redirect = redirects.find((r) => r.from === req.route.path)
  if (redirect) {
    // res.writeHead(301, { Location: redirect.to })
    // res.end()
    req.redirect(redirect.to)
  }
}
