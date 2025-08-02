const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');

dotenv.config();
connectDB();

require('./src/config/passport')(passport);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use('/api/auth', authRoutes);
app.use('/api', urlRoutes);

app.get('/', (req, res) => {
  res.send('URL Shortener API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Advanced URL Shortener API',
      version: '1.0.0',
      description: 'A scalable URL shortener with advanced analytics.',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        GoogleOAuth: {
          type: 'oauth2',
          flows: {
            implicit: {
              authorizationUrl: 'http://localhost:5000/api/auth/google',
              scopes: {
                profile: 'Grants access to a user\'s basic profile information.',
              },
            },
          },
        },
      },
    },
    security: [{
      GoogleOAuth: ['profile'],
    }],
  },
  apis: ['./src/routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
