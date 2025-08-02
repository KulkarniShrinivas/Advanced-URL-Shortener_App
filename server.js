const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');

dotenv.config();
connectDB();

// Passport config
require('./src/config/passport')(passport);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware (MUST come before passport middleware)
app.use(
  session({
    secret: 'your_secret_key', // You can add this to your .env file
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', urlRoutes);

app.get('/', (req, res) => {
  res.send('URL Shortener API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});