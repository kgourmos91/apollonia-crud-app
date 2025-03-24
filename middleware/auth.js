// middleware/auth.js
require('dotenv').config();

module.exports = (req, res, next) => {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const [username, password] = Buffer.from(auth.split(' ')[1], 'base64')
        .toString()
        .split(':');

    // Log failed authentication attempts for security purposes
    if (
        username === process.env.BASIC_USER &&
        password === process.env.BASIC_PASS
    ) {
        return next();
    } else {
        console.warn(`Failed login attempt with username: ${username}`);
        return res.status(403).json({ error: 'Invalid credentials' });
    }
};
