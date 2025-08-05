


# Advanced URL Shortener Backend

Welcome to the backend repository for the **Advanced URL Shortener** project!
This API offers robust URL shortening capabilities, including user authentication, detailed analytics, and essential security features like rate limiting and caching. The goal is to deliver a scalable, efficient service that simplifies URL sharing while offering valuable insights into link performance.


## Features

This backend API powers the core logic of the URL shortener:

* **Google Sign-In Authentication**
  Secure authentication via Google Sign-In for a smooth and trusted login experience.

* ** URL Shortening API** (`POST /api/shorten`)

  * Convert long URLs into short, memorable ones
  * Supports optional **custom aliases**
  * Group links by topic (e.g., `acquisition`, `marketing`) for organized analytics
  * Includes **rate limiting** to prevent abuse

* ** Smart Redirects** (`GET /:alias`)

  * Redirects to the original URL when a short link is accessed
  * Captures analytics: timestamp, user agent, IP, geolocation, OS, device

* **Analytics APIs**

  * **Specific URL Analytics:** `GET /api/analytics/:alias`
  * **Topic-Based Analytics:** `GET /api/analytics/topic/:topic`
  * **Overall Analytics:** `GET /api/analytics/overall`

* ** Caching with Redis**

  * Accelerates performance by caching both redirects and analytics data

* ** API Documentation**

  * Complete Swagger/OpenAPI documentation for all endpoints


##  Technologies Used

* **Node.js** & **Express.js** – Backend framework
* **MongoDB + Mongoose** – NoSQL database
* **Redis** – Caching layer
* **Passport.js (Google OAuth)** – User authentication
* **express-session + connect-mongo** – Session management
* **express-rate-limit** – API rate limiting
* **Swagger (swagger-jsdoc & swagger-ui-express)** – API documentation
* **dotenv** – Environment variable management


## 🛠️ Getting Started (Local Development)

1. **Clone the Repository**

   ```bash
   git clone https://github.com/KulkarniShrinivas/Advanced-URL-Shortener_App.git
   cd Advanced-URL-Shortener_App
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file with the following:

   ```env
   PORT=5000
   MONGO_URI=your_mongo_uri
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   REDIS_HOST=localhost
   REDIS_PORT=6379
   SESSION_SECRET=your_secure_session_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```

   >  **Notes**:
   >
   > * Set up a Google OAuth2.0 client in the [Google Cloud Console](https://console.cloud.google.com/)
   > * Make sure MongoDB Atlas allows your IP
   > * Ensure Redis is running locally or through Docker

4. **Run the Backend**

   ```bash
   npm start
   # or
   npm run dev
   ```

   Visit: [http://localhost:5000](http://localhost:5000)



##  Deployment

* **Live Backend:** [https://advanced-url-shortener-app-gpx2.onrender.com](https://advanced-url-shortener-app-gpx2.onrender.com)

* **Environment Variables:** Same as local `.env`, configured via Render's environment settings

* **Google OAuth Redirect URI for Production:**

  ```
  https://advanced-url-shortener-app-gpx2.onrender.com/api/auth/google/callback
  ```

* **CORS Configuration:**
  Currently set to `*` for testing. In production, restrict to your frontend domain (e.g., `https://your-frontend.netlify.app`).



## 📚 API Documentation

* **Local:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
* **Live:** [https://advanced-url-shortener-app-gpx2.onrender.com/api-docs](https://advanced-url-shortener-app-gpx2.onrender.com/api-docs)


## 📐 Architecture & Design Decisions

* **Modular Codebase** – Routes, controllers, models, middlewares, and configs separated for maintainability
* **Authentication** – Google Sign-In via Passport.js; sessions stored securely in MongoDB
* **Rate Limiting** – Express-rate-limit with IP-based keying for abuse prevention
* **URL Analytics** – Tracked per redirect and grouped by topic or user
* **Redis Caching** – Boosts performance for frequently accessed data
* **Swagger Docs** – Developer-friendly API interface

---




