const { error } = require('selenium-webdriver');
const Click = require('../models/Click');
const userAgentParser = require('../utils/userAgentParser');
const geoLocator = require('../utils/geoLocator');
const URL = require('../models/URL');
const generateAlias = require('../utils/aliasGenerator');
const redisClient = require('../config/redis');

exports.createShortURL = async (req, res) => {
    const { longUrl, customAlias, topic } = req.body;

    if (!longUrl) {
        return res.status(400).json({ message: 'Please provide a valid URL' });
    }

    try {
        let alias = customAlias;

        if (alias) {
            const existingUrl = await URL.findOne({ alias });
            if (existingUrl) {
                return res.status(400).json({ error: 'Custom alias already exists' });
            }
        } else {
            alias = generateAlias();

            let isUnique = false;
            while (!isUnique) {
                const existingUrl = await URL.findOne({ alias });
                if (!existingUrl) {
                    isUnique = true;
                } else {
                    alias = generateAlias();
                }
            }
        }

        const shortUrl = `${req.protocol}://${req.get('host')}/${alias}`;

        const newUrl = new URL({
            longUrl,
            shortUrl,
            alias,
            topic,
            user: req.user.id,
        });

        await newUrl.save();
        res.status(201).json(newUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.redirectToLongUrl = async (req, res) =>{
    const { alias } = req.params;

    try{
        const url = await URL.findOne({alias});

        if(url){
            logClick(req, res);
            return res.redirect(url.longUrl);
        } else {
            return res.status(400).send('URL not found');
        }
    } catch(err){
        console.error(err);
        return res.status(500).json({error: 'Server error' });
    }
};

const logClick = async(req, url) => {
    try{
        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;

        const {os, device} = userAgentParser.parse(userAgent);
        const {country, city} = geoLocator.locate(ipAddress);

        const newClick = new Click({
            url: url._id,
            ipAddress: ipAddress,
            userAgent: userAgent,
            osType: os.name,
            deviceType: device.type,
            country: country,
            city: city,
        });

        await newClick.save();
    } catch(err){
        console.error('Error logging click', err);
    }
};