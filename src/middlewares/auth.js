const jwt = require('jsonwebtoken');

const authConfig = process.env.AUTH_SECRET;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ message: 'No token provided.' });
  }

  const parts = authorization.split(' ');

  if (!parts.length === 2) {
    return res.status(401).send({ message: 'Token error.' });
  }

  const [bearer, token] = parts;

  if (!/^Bearer$/i.test(bearer)) {
    return res.status(401).send({ message: 'Token malformatted.' });
  }

  jwt.verify(token, authConfig, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Token invalid.' });
    }
    req.userId = decoded.id;
    return next();
  });
};
