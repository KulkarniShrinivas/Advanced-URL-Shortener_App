const { model } = require('mongoose');
const {nanoid} = require('nanoid');

const generateAlias = (length = 7) => {
    return nanoid(length);
}

model.exports = generateAlias;