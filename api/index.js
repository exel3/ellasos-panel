const axios = require('axios')
const Cookies = require('cookies')
// const app = require('express')()
const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
module.exports = { path: '/api', handler: app }

const getToken = (req, res) => {
  const cookies = new Cookies(req, res)
  const token = cookies.get('token')
  console.log(token)
  return token
}

const getUser = (req, res) => {
  const cookies = new Cookies(req, res)
  const user = JSON.parse(cookies.get('user'))
  return user
}

const deleteToken = (req, res) => {
  const cookies = new Cookies(req, res)
  cookies.set('token', null, {
    maxAge: 1 * 1,
    httpOnly: true
  })
  cookies.set('user', null, {
    maxAge: 1 * 1,
    httpOnly: true
  })
}

app.get('/', (req, res) => {
  res.statusCode = 200
  res.json(getToken(req, res))
})
app.post('/client/login', (req, res) => {
  const post = {
    username: req.body.username,
    password: req.body.password
  }

  axios.post('https://ellasos.herokuapp.com/api/client/login', post)
    .then(response => {
      const { client, token } = response.data
      const { id, username, permissionForQuestions } = client
      const dataClient = { id, username, type: 'client', permissionForQuestions }
      const cookies = new Cookies(req, res)
      if (token) {
        cookies.set('token', 'Bearer ' + token, {
          maxAge: 3600000 * 12,
          httpOnly: true
        })

        cookies.set('user', JSON.stringify(dataClient), {
          maxAge: 3600000 * 12,
          httpOnly: true
        })

        res.json({
          data: dataClient
        })
      }
    })
    .catch(e => {
      res.statusCode = 400
      res.json({
        error: e.message
      })
    })
})
app.get('/getClient/:id', (req, res) => {
  const { id } = req.params
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://ellasos.herokuapp.com/api/client/getClientById/${id}`, get)
    .then(
      response => {
        res.json(response.data)
      }
    )
    .catch(e => {
      res.statusCode = e.response.status
      res.json({
        error: e.message
      })
    })
})
app.get('/getAdmin/:id', (req, res) => {
  const { id } = req.params
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://ellasos.herokuapp.com/api/admin/getAdminById/${id}`, get)
    .then(
      response => {
        res.json(response.data)
      }
    )
    .catch(e => {
      res.statusCode = e.response.status
      res.json({
        error: e.message
      })
    })
})
app.get('/getAllCountries', (req, res) => {
  const page = 0
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://ellasos.herokuapp.com/api/countries/getAllCountriesWithPagination/${page}`, get)
    .then(
      response => {
        res.json(response.data)
      }
    )
    .catch(e => {
      res.statusCode = e.response.status
      res.json({
        error: e.message
      })
    })
})
app.get('/getAllAdmins', (req, res) => {
  const page = 1
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://ellasos.herokuapp.com/api/admins/findAllAdminsWithPagination/${page}`, get)
    .then(
      response => {
        res.json(response.data)
      }
    )
    .catch(e => {
      res.statusCode = e.response.status
      res.json({
        error: e.message
      })
    })
})
app.post('/createNewAdmin', (req, res) => {
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = {
    email: body.email,
    password: body.password
  }

  axios.post('https://ellasos.herokuapp.com/api/admins/register', data, headers)
    .then(
      response => {
        res.json(response.data)
      }
    )
    .catch(e => {
      res.statusCode = e.response.status
      res.json({
        error: e.response.data
      })
    })
})
app.put('/updateAdmin/:adminID', (req, res) => {
  const { adminID } = req.params
  const body = req.body
  const { namesAndSurname, password, country, avatar } = body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = { namesAndSurname, password, country, avatar }
  console.log(data)

  axios.put(`https://ellasos.herokuapp.com/api/admins/update/${adminID}`, data, headers)
    .then(
      response => {
        res.json(response.data)
      }
    )
    .catch(e => {
      res.statusCode = e.response.status
      res.json({
        error: e.response.data
      })
    })
})
app.delete('/deleteAdmin/:adminID', (req, res) => {
  const { adminID } = req.params
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  axios.delete(`https://ellasos.herokuapp.com/api/admins/delete/${adminID}`, headers)
    .then(
      response => {
        res.json(response.data)
      }
    )
    .catch(e => {
      res.statusCode = e.response.status
      res.json({
        error: e.response.data
      })
    })
})
app.post('/admin/login', (req, res) => {
  const post = {
    email: req.body.username,
    password: req.body.password
  }
  axios.post('https://ellasos.herokuapp.com/api/admins/login', post)
    .then(response => {
      const { token, admin } = response.data
      const { id, email } = admin
      const dataAdmin = { id, email, type: 'admin' }
      const cookies = new Cookies(req, res)
      if (token) {
        cookies.set('token', 'Bearer ' + token, {
          maxAge: 3600000 * 12,
          httpOnly: true
        })

        cookies.set('user', JSON.stringify(dataAdmin), {
          maxAge: 3600000 * 12,
          httpOnly: true
        })

        res.json({
          data: dataAdmin
        })
      }
    })
    .catch(e => {
      res.statusCode = e.response.status
      res.json({
        error: e.message
      })
    })
})
app.post('/getAllTablesByClientAndLocal/:clientID/:localID/:page', (req, res) => {
  const { clientID, localID, page } = req.params
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  const bodyGet = req.body
  axios.post(`https://ellasos.herokuapp.com/api/table/getAllTables/filter/client/${clientID}/local/${localID}/page/${page}`, bodyGet, get)
    .then(
      response => {
        res.json(response.data)
      }
    )
    .catch(e => {
      res.statusCode = e.response.status
      res.json({
        error: e.message
      })
    })
})
app.get('/getUser', (req, res) => {
  const user = getUser(req, res)
  res.json(user)
})
app.delete('/clearSesion', (req, res) => {
  try {
    deleteToken(req, res)
    res.end('Token deleted')
  } catch (error) {
    res.end(error)
  }
})
