const crypto = require('crypto');
// receives object with title and content keys
// returns string
module.exports = ({title, content}) => {
    const hashContent = title + content;
    const hashSeed = 'whiskey';
    return crypto.createHmac('sha256', hashSeed)
    .update(hashContent)
    .digest('hex');
}