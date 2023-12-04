const authenticatedUsers = [];

const isAuthenticated = (req, res, next) => {
  const { email, code } = req.query;
  console.log('Email:', decodeURIComponent(email), 'Code:', decodeURIComponent(code));

  if (email && code) {
      //here, perform a check against the database if the provided email and code exist and are valid
      //if they are valid, mark the user as authenticated
      req.isAuthenticated = true;
      req.user = { email, code };
      next();
  } else {
      return res.send('Invalid link!');
  }
};

module.exports = { isAuthenticated, authenticatedUsers };
