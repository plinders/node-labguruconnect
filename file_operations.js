const fs = require('fs');
const path = require('path');
const axios = require('axios');
const request = require('request');

const downloadFile = async (server, url, token, folder, filename) => {
    const dlUrl = `${server}${url}?token=${token}`;

    const filePath = path.resolve(__dirname, folder, filename);

    const response = await axios({
        method: 'GET',
        url: dlUrl,
        responseType: 'stream'
    });

    response.data.pipe(fs.createWriteStream(filePath));

    return new Promise((resolve, reject) => {
        response.data.on('end', () => {
            resolve();
        });

        response.data.on('error', () => {
            reject();
        });
    });
};

const uploadFile = async (server, token, file, uuid) => {
    const filename = path.parse(file).name;
    const ulUrl = `${server}/api/v1/attachments.json`;
    var options = {
        method: 'POST',
        url: ulUrl,
        headers: {
            'content-type': 'multipart/form-data'
        },
        formData: {
            'item[attachment]': {
                value: fs.createReadStream(__dirname + '/' + file),
                options: {
                    filename: file
                }
            },
            token: token,
            'item[title]': filename,
            'item[attach_to_uuid]': uuid,
            'item[description]': filename
        }
    };

    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if (err) {
                reject(err)
            } else {
                resolve(JSON.parse(body))
            }

        });
    });


}

module.exports = {
    downloadFile,
    uploadFile
};