const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');

const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const urlRoutes = require('./src/routes/urlRoutes');
const redirectRoutes = require('./src/routes/redirectRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

dotenv.config();
connectDB();

const app = express();

app.set('trust proxy', true);

app.use(cors({
    origin: '*', 
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

require('./src/config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());


const BASE_BACKEND_URL = process.env.NODE_ENV === 'production'
    ? 'https://advanced-url-shortener-app-gpx2.onrender.com'
    : 'http://localhost:5000';


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
        url: `${BASE_BACKEND_URL}/api`, 
        description: process.env.NODE_ENV === 'production' ? 'Deployed backend server' : 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        GoogleOAuth: {
          type: 'oauth2',
          flows: {
            implicit: {
              authorizationUrl: `${BASE_BACKEND_URL}/api/auth/google`, 
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

app.use('/api/auth', authRoutes);
app.use('/api', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use('/', dashboardRoutes);
app.use('/', redirectRoutes);

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard'); 
  } else {
    res.redirect('/api/auth/google');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
