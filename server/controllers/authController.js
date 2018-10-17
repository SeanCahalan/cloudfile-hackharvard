module.exports = {
  login: function(req, res, next) {
    return res.status(200).send('you are now logged in')
  }
}
