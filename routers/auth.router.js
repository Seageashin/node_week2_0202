const express = require('express');
const router = express.Router();
const { prisma } = require('./models/users.model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;


router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Create user using Prisma
    const user = await prisma.users.create({ data: { email, password, name } });

    // Return user data (excluding password)
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user by email using Prisma
    const user = await getUserByEmail(email);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '12h',
    });

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
