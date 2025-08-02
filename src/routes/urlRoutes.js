const express = require('express');
const router = express.Router();
const { createShortUrl, redirectToLongUrl } = require('../controllers/urlController');
const { createUrlLimiter } = require('../middlewares/rateLimiter'); 
const { protect } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 * name: URLs
 * description: Create and manage your shortened links.
 */

/**
 * @swagger
 * /shorten:
 * post:
 * summary: Create a new short URL
 * tags: [URLs]
 * description: This is the main endpoint to shorten a long URL. You can optionally provide your own custom alias or categorize the link with a topic for better tracking.
 * security:
 * - GoogleOAuth: ['profile']
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * longUrl:
 * type: string
 * description: The original URL you want to shorten.
 * example: "https://www.example.com/a-very-long-url-for-my-marketing-campaign"
 * customAlias:
 * type: string
 * description: (Optional) Your preferred short link name. It must be unique!
 * example: "my-campaign-alias"
 * topic:
 * type: string
 * description: (Optional) A topic to help group your links. Great for segmenting analytics later.
 * example: "acquisition"
 * responses:
 * 201:
 * description: The short URL was created successfully.
 * 400:
 * description: The longUrl field is missing from your request.
 * 401:
 * description: You need to be logged in to create a URL.
 * 409:
 * description: The custom alias you chose is already in use.
 * 429:
 * description: You've created too many URLs recently. Please try again later.
 */
router.post('/shorten', protect, createUrlLimiter, createShortUrl);

/**
 * @swagger
 * /{alias}:
 * get:
 * summary: Redirect to the original URL
 * tags: [URLs]
 * description: When a user clicks on one of your short links, this endpoint will redirect them to the original URL and automatically log their visit for analytics.
 * parameters:
 * - in: path
 * name: alias
 * required: true
 * schema:
 * type: string
 * description: The unique short code for the URL.
 * example: "aBcDeF"
 * responses:
 * 302:
 * description: Redirect to the original long URL.
 * 404:
 * description: The short URL could not be found.
 */
router.get('/:alias', redirectToLongUrl);

module.exports = router;