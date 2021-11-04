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

  axios.post('https://happymatch.herokuapp.com/api/client/login', post)
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
  axios.get(`https://happymatch.herokuapp.com/api/client/getClientById/${id}`, get)
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
  axios.get(`https://happymatch.herokuapp.com/api/admin/getAdminById/${id}`, get)
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
app.get('/getAllClients', (req, res) => {
  const page = 0
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://happymatch.herokuapp.com/api/client/getAllClients/page/${page}`, get)
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
app.post('/createNewClient', (req, res) => {
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = {
    username: body.username,
    emailAddress: body.emailAddress,
    password: body.password
  }

  axios.post('https://happymatch.herokuapp.com/api/client/create', data, headers)
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
app.put('/updateClient/:clientID', (req, res) => {
  const { clientID } = req.params
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = body
  axios.put(`https://happymatch.herokuapp.com/api/client/update/${clientID}`, data, headers)
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
app.delete('/deleteClient/:clientID', (req, res) => {
  const { clientID } = req.params
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  axios.delete(`https://happymatch.herokuapp.com/api/client/delete/${clientID}`, headers)
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
app.get('/getAllAdmins', (req, res) => {
  const page = 0
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://happymatch.herokuapp.com/api/admin/getAllAdmins/page/${page}`, get)
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
    username: body.username,
    emailAddress: body.emailAddress,
    password: body.password
  }

  axios.post('https://happymatch.herokuapp.com/api/admin/create', data, headers)
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
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = {
    username: body.username,
    emailAddress: body.emailAddress,
    password: body.password
  }

  axios.put(`https://happymatch.herokuapp.com/api/admin/update/${adminID}`, data, headers)
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
  axios.delete(`https://happymatch.herokuapp.com/api/admin/delete/${adminID}`, headers)
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
app.get('/getAllLocals', (req, res) => {
  const page = 0
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://happymatch.herokuapp.com/api/local/getAllLocals/page/${page}`, get)
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
app.get('/getLocalsByClient/:clientID', (req, res) => {
  const page = 0
  const { clientID } = req.params
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://happymatch.herokuapp.com/api/local/getAllLocals/client/${clientID}/page/${page}`, get)
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
app.post('/createNewLocal', (req, res) => {
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = body

  axios.post('https://happymatch.herokuapp.com/api/local/create', data, headers)
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
app.put('/updateLocal/:localID', (req, res) => {
  const { localID } = req.params
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = body

  axios.put(`https://happymatch.herokuapp.com/api/local/update/${localID}`, data, headers)
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
app.delete('/deleteLocal/:localID', (req, res) => {
  const { localID } = req.params
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  axios.delete(`https://happymatch.herokuapp.com/api/local/delete/${localID}`, headers)
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
    username: req.body.username,
    password: req.body.password
  }

  axios.post('https://happymatch.herokuapp.com/api/admin/login', post)
    .then(response => {
      const { token, admin } = response.data
      const { id, username } = admin
      const dataAdmin = { id, username, type: 'admin' }
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
  axios.post(`https://happymatch.herokuapp.com/api/table/getAllTables/filter/client/${clientID}/local/${localID}/page/${page}`, bodyGet, get)
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
app.post('/createNewTable', (req, res) => {
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = body

  axios.post('https://happymatch.herokuapp.com/api/table/create', data, headers)
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
app.put('/updateTable/:tableID', (req, res) => {
  const { tableID } = req.params
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = body

  axios.put(`https://happymatch.herokuapp.com/api/table/update/${tableID}`, data, headers)
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
app.delete('/deleteTable/:tableID', (req, res) => {
  const { tableID } = req.params
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  axios.delete(`https://happymatch.herokuapp.com/api/table/delete/${tableID}`, headers)
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
app.post('/createNewQR', (req, res) => {
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = body

  axios.post('https://happymatch.herokuapp.com/api/qr/create', data, headers)
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
app.put('/updateQR/:qrID', (req, res) => {
  const { qrID } = req.params
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = body

  axios.put(`https://happymatch.herokuapp.com/api/qr/update/${qrID}`, data, headers)
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
app.delete('/deleteQR/:id', (req, res) => {
  const { id } = req.params
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  axios.delete(`https://happymatch.herokuapp.com/api/qr/delete/${id}`, headers)
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
app.get('/getUser', (req, res) => {
  const user = getUser(req, res)
  res.json(user)
})
app.get('/getQuestionsByLocalId/:localId', (req, res) => {
  const { localId } = req.params
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://happymatch.herokuapp.com/api/questions/getQuestionsByLocalId/${localId}`, get)
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
app.post('/createQuestions/:localId', (req, res) => {
  const body = req.body
  const token = getToken(req, res)
  const { localId } = req.params

  const data = {
    localId,
    arrayQuestions: body
  }
  const headers = {
    headers:
      { authorization: token }
  }

  axios.post('https://happymatch.herokuapp.com/api/questions/create', data, headers)
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
app.put('/updateQuestions/:localId', (req, res) => {
  const body = req.body
  const token = getToken(req, res)
  const { localId } = req.params

  const data = {
    arrayQuestions: body
  }
  const headers = {
    headers:
      { authorization: token }
  }

  axios.put(`https://happymatch.herokuapp.com/api/questions/update/${localId}`, data, headers)
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
app.get('/getGlobalQuestions', (req, res) => {
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get('https://happymatch.herokuapp.com/api/globalquestions/getGlobalQuestions', get)
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
app.post('/createGlobalQuestions', (req, res) => {
  const body = req.body
  const token = getToken(req, res)

  const data = {
    arrayQuestions: body
  }
  const headers = {
    headers:
      { authorization: token }
  }

  axios.post('https://happymatch.herokuapp.com/api/globalquestions/create', data, headers)
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
app.put('/updateGlobalQuestions', (req, res) => {
  const body = req.body
  const token = getToken(req, res)

  const data = {
    arrayQuestions: body
  }
  const headers = {
    headers:
      { authorization: token }
  }

  axios.put('https://happymatch.herokuapp.com/api/globalquestions/update', data, headers)
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
app.post('/getAllUsers/:page', (req, res) => {
  const { page } = req.params
  const { namesAndSurname, emailAddress } = req.body
  const token = getToken(req, res)

  const data = {
    namesAndSurname,
    emailAddress
  }
  const headers = {
    headers:
      { authorization: token }
  }

  axios.post(`https://happymatch.herokuapp.com/api/user/getAllUsers/filter/page/${page}`, data, headers)
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
app.post('/banUser/:idUser', (req, res) => {
  const { idUser } = req.params
  const token = getToken(req, res)
  const data = req.body
  const headers = {
    headers:
      { authorization: token }
  }

  axios.post(`https://happymatch.herokuapp.com/api/ban/${idUser}`, data, headers)
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
app.delete('/unBanUser/:idUser', (req, res) => {
  const { idUser } = req.params
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }

  axios.delete(`https://happymatch.herokuapp.com/api/ban/unban/${idUser}`, headers)
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
app.get('/getAllBans', (req, res) => {
  const page = 1
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://happymatch.herokuapp.com/api/ban/getAllBans/page/${page}`, get)
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
app.post('/banGroup/:idGroup', (req, res) => {
  const { idGroup } = req.params
  const token = getToken(req, res)
  const data = req.body
  const headers = {
    headers:
      { authorization: token }
  }

  axios.post(`https://happymatch.herokuapp.com/api/groupban/${idGroup}`, data, headers)
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
app.get('/getGroupTables/:localID', (req, res) => {
  const { localID } = req.params
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://happymatch.herokuapp.com/api/grouptable/getAllGroupTablesByLocalId/${localID}`, get)
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
app.post('/banGroupTable/:idGroup', (req, res) => {
  const { idGroup } = req.params
  const body = req.body
  const token = getToken(req, res)
  const data = {
    reason: body.reason
  }
  axios.post(`https://happymatch.herokuapp.com/api/groupBans/${idGroup}`, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`
    }
  }).then(response => {
    res.json(response.data)
  })
    .catch(e => {
      res.statusCode = e.response.status
      res.json({
        error: e.message
      })
    })
})
app.delete('/unBanGroupTable/:idGroup', (req, res) => {
  const { idGroup } = req.params
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }

  axios.delete(`https://happymatch.herokuapp.com/api/groupban/unban/${idGroup}`, headers)
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
app.get('/getAllGroupBans/:clientID', (req, res) => {
  const { clientID } = req.params
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://happymatch.herokuapp.com/api/groupban/getGroupsBanByClientId/${clientID}`, get)
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
app.delete('/deleteGroup/:idGroup', (req, res) => {
  const { idGroup } = req.params
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }

  axios.delete(`https://happymatch.herokuapp.com/api/grouptable/delete/${idGroup}`, headers)
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
app.delete('/clearSesion', (req, res) => {
  try {
    deleteToken(req, res)
    res.end('Token deleted')
  } catch (error) {
    res.end(error)
  }
})
