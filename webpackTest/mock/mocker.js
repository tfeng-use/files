module.exports = {
  'GET /user': { name: '刘小夕12345', age: 18 },
  'POST /login/account': (req, res) => {
    const { password, username } = req.body
    if (password === '888888' && username === 'admin') {
      return res.send({
        status: 'ok',
        code: 0,
        token: '1234567890',
        data: { id: 1, name: '刘小夕123456' }
      })
    } else {
      return res.send({ status: 'error', code: 403 })
    }
  }
}
