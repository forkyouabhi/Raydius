import jwt from 'jsonwebtoken';

/**
 * This middleware function verifies the JSON Web Token (JWT) sent in the
 * Authorization header of a request. If the token is valid, it attaches
 * the decoded user payload to the request object and calls the next
 * middleware. Otherwise, it sends a 401 Unauthorized response.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user information from the token to the request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
  }
};

export default authMiddleware;

