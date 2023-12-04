const authenticatedUsers = [];

const isAuthenticated = (req, res, next) => {
  const { email, code } = req.query;
  console.log('Email:', email, 'Code:', code);

  if (email && code) {
      authenticatedUsers.push({ email, code });

      req.isAuthenticated = true;
      req.user = { email, code };
      next();
  } else {
      return res.send("Invalid link!");
  }
};

module.exports = { isAuthenticated, authenticatedUsers };