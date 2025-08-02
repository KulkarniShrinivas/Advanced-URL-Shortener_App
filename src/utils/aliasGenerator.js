const { nanoid } = require('nanoid');

const generateAlias = (length = 7) => {
    return nanoid(length);
};

module.exports = generateAlias;