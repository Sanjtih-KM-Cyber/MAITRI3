import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';

const router = Router();

// In-memory store for demonstration purposes.
// In a real application, this would be a database.
const users: { [username: string]: { passwordHash: string } } = {};
const saltRounds = 10;

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  if (users[username]) {
    return res.status(409).json({ message: 'Username already exists.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    users[username] = { passwordHash };
    
    console.log(`User registered: ${username}`);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Log in a user
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  
  const user = users[username];
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  try {
    const match = await bcrypt.compare(password, user.passwordHash);
    if (match) {
        console.log(`User logged in: ${username}`);
      // In a real app, you would issue a JWT here.
      res.status(200).json({ message: 'Login successful.' });
    } else {
      res.status(401).json({ message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

export default router;
