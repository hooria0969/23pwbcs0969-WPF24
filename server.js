const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//INITIALIZE APP
const app = express()
const port = 5000

//MIDDLEWARE
app.use(express.json())

//connection to database
const connectDB = require('./Database/DatabaseConnection');
connectDB();

//DatabaseSchemas 
const UserModel = require('./Model/UserSchema');

// Default Route
app.get('/', async (req, res) => {

    res.json({ message: 'HELLO WORLD' });
})

// Sign Up Route
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newuser = new UserModel({ username, email, password: hashedPassword });
        await newuser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user.' });
    }
});

// Signin Route
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(400).json({ message: 'Invalid credentials.' });

        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in.' });
    }
});

// Protected Route
app.get('/api/protected', async (req, res) => {
const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, 'secret');

        res.status(200).json({
            message: 'Protected resource accessed successfully!',
            userId: decoded.id,
        });
    } catch (err) {
        console.error('Error accessing protected route:', err);
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
});



// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



