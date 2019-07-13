const fetch = require('node-fetch');
const fs = require('fs');

module.exports = async function filesPipe(fileUrl, filePath) {
    let result = await fetch(fileUrl);
    const dest = fs.createWriteStream(filePath);
    result.body.pipe(dest);
};