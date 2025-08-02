const UAParser = require('ua-parser-js');

exports.parse = (userAgentString) => {
    const parser = new UAParser(userAgentString);
    return{
        os: parser.getOS(),
        device: parser.getDevice(),
    };
};