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
app.get('/getAdmin/:id', (req, res) => {
  const { id } = req.params
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://ellasos.herokuapp.com/api/admins/findAdminById/${id}`, get)
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
app.post('/createNewCountry', (req, res) => {
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = { ...body }

  axios.post('https://ellasos.herokuapp.com/api/countries/create', data, headers)
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
app.put('/updateCountry/:countryID', (req, res) => {
  const { countryID } = req.params
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = { ...body }
  axios.put(`https://ellasos.herokuapp.com/api/countries/update/${countryID}`, data, headers)
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
app.delete('/deleteCountry/:countryID', (req, res) => {
  const { countryID } = req.params
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  axios.delete(`https://ellasos.herokuapp.com/api/countries/delete/${countryID}`, headers)
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
  const data = { ...body }

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
      const { id, email, isMain, country } = admin
      const dataAdmin = { id, email, isMain, country }
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
app.get('/emailExist/:email', (req, res) => {
  const { email } = req.params
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://ellasos.herokuapp.com/api/admins/emailExist/${email}`, get)
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
app.post('/changeEmail/:id', (req, res) => {
  const { id } = req.params
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = { ...body }
  axios.post(`https://ellasos.herokuapp.com/api/admins/changeEmail/${id}`, data, headers)
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
app.post('/forgotPassword/:email', (req, res) => {
  const { email } = req.params
  axios.post(`https://ellasos.herokuapp.com/api/admins/forgotpassword/${email}`)
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
app.get('/getAllUsers', (req, res) => {
  const page = 1
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get(`https://ellasos.herokuapp.com/api/users/findAllUsers/${page}`, get)
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
app.put('/updateUser/:userID', (req, res) => {
  const { userID } = req.params
  const body = req.body
  const { namesAndSurname, password, country, avatar } = body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = { namesAndSurname, password, country, avatar }
  axios.put(`https://ellasos.herokuapp.com/api/users/update/${userID}`, data, headers)
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
app.delete('/deleteUser/:userID', (req, res) => {
  const { userID } = req.params
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  axios.delete(`https://ellasos.herokuapp.com/api/users/delete/${userID}`, headers)
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
app.post('/getAllQuestions/:page', (req, res) => {
  const { page } = req.params
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = body

  axios.post(`https://ellasos.herokuapp.com/api/questions/findQuestionsByCountryWithPagination/${page}`, data, headers)
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
app.post('/createNewQuestion', (req, res) => {
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = { ...body }
  axios.post('https://ellasos.herokuapp.com/api/questions/create', data, headers)
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
app.put('/updateQuestion/:questionID', (req, res) => {
  const { questionID } = req.params
  const { question, answer } = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = { question, answer, country: null }
  axios.put(`https://ellasos.herokuapp.com/api/questions/update/${questionID}`, data, headers)
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
app.delete('/deleteQuestion/:questionID', (req, res) => {
  const { questionID } = req.params
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  axios.delete(`https://ellasos.herokuapp.com/api/questions/delete/${questionID}`, headers)
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
app.post('/getAllActions/:page', (req, res) => {
  const { page } = req.params
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = body

  axios.post(`https://ellasos.herokuapp.com/api/actions/findActionsByCountryWithPagination/${page}`, data, headers)
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
app.post('/createNewAction', (req, res) => {
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = { ...body }
  axios.post('https://ellasos.herokuapp.com/api/actions/create', data, headers)
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
app.put('/updateAction/:actionID', (req, res) => {
  const { actionID } = req.params
  const { name, content } = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = { name, content, country: null }
  axios.put(`https://ellasos.herokuapp.com/api/actions/update/${actionID}`, data, headers)
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
app.delete('/deleteAction/:actionID', (req, res) => {
  const { actionID } = req.params
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  axios.delete(`https://ellasos.herokuapp.com/api/actions/delete/${actionID}`, headers)
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
app.get('/getAllButtons', (req, res) => {
  const token = getToken(req, res)
  const get = { headers: { Authorization: token } }
  axios.get('https://ellasos.herokuapp.com/api/buttons/findAllButtons', get)
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
app.post('/createNewButton', (req, res) => {
  const body = req.body
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = { ...body }
  axios.post('https://ellasos.herokuapp.com/api/buttons/register', data, headers)
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
app.put('/updateButton/:buttonID', (req, res) => {
  const { buttonID } = req.params
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  const data = { ...req.body }
  axios.put(`https://ellasos.herokuapp.com/api/buttons/update/${buttonID}`, data, headers)
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
app.delete('/deleteButton/:buttonID', (req, res) => {
  const { buttonID } = req.params
  const token = getToken(req, res)
  const headers = {
    headers:
      { authorization: token }
  }
  axios.delete(`https://ellasos.herokuapp.com/api/buttons/delete/${buttonID}`, headers)
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
app.delete('/clearSesion', (req, res) => {
  try {
    deleteToken(req, res)
    res.end('Token deleted')
  } catch (error) {
    res.end(error)
  }
})
