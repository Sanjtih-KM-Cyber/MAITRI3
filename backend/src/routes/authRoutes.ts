import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';

const router = Router();

// In-memory store for demonstration. In a real app, use a database.
const users: { 
  [username: string]: { 
    passwordHash: string;
    securityQuestion: string; // Store the plain text question
    securityAnswerHash: string;
  } 
} = {};

const saltRounds = 10;

// Register a new user with security question
router.post('/register', async (req: Request, res: Response) => {
  const { username, password, securityQuestion, securityAnswer } = req.body;

  if (!username || !password || !securityQuestion || !securityAnswer) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (users[username]) {
    return res.status(409).json({ message: 'Username already exists.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const securityAnswerHash = await bcrypt.hash(securityAnswer.toLowerCase(), saltRounds); // Standardize answer to lowercase

    users[username] = { passwordHash, securityQuestion, securityAnswerHash };
    
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
      res.status(200).json({ message: 'Login successful.', user: { name: username } });
    } else {
      res.status(401).json({ message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Get security question for a user
router.get('/security-question/:username', (req: Request, res: Response) => {
    const { username } = req.params;
    const user = users[username];
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ securityQuestion: user.securityQuestion });
});


// Reset password after answering security question
router.post('/reset-password', async (req: Request, res: Response) => {
    const { username, securityAnswer, newPassword } = req.body;
    if (!username || !securityAnswer || !newPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const user = users[username];
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    try {
        const answerMatch = await bcrypt.compare(securityAnswer.toLowerCase(), user.securityAnswerHash);
        if (!answerMatch) {
            return res.status(401).json({ message: 'Incorrect answer to security question.' });
        }

        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
        users[username].passwordHash = newPasswordHash;

        console.log(`Password reset for user: ${username}`);
        res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Server error during password reset.' });
    }
});


export default router;
