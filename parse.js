const tableify = require('tableify');
const fs = require('fs');

const api = require('./api.js');
const fileOps = require('./file_operations.js');

const parseSamplesElement = async (elementData) => {
    const jsonData = JSON.parse(elementData)
    var types = Object.keys(jsonData.headers);
    var data = '<p>';
    data += '<h3>Samples used:</h3>'
    for (type of types) {
        data += '<p>';
        data += `<em>${type}</em>`;
        data += `<ul>`;
        for (sample of jsonData.samples) {
            if (sample.collection_name === type) {
                data += `<li>${sample.name}</li>`;
            }
        }
        data += `</ul>`;
        data += '<p>';
    }
    return data;
};

const parseAttachmentsElement = async (server, token, elementData, expTitle) => {

    const jsonData = JSON.parse(elementData);
    const dir = `./${expTitle}`


    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    };

    var data = '<p>';
    data += '<h3>Attachments:</h3>'
    data += '<p>';
    data += '<ul>';
    for (attachment of jsonData) {
        const attachmentJSON = await api.getAttachment(server, token, attachment.id);
        await fileOps.downloadFile(server, attachmentJSON.annotated_url, token, expTitle, attachment.filename);
        data += `<li><a href="./${expTitle}/${attachment.filename}">${attachment.filename}</a>`;
    }
    data += `</ul>`;
    data += '<p>';
    return data;
};

const parseStepsElement = async (elementData) => {
    const jsonData = JSON.parse(elementData);

    var data = '<p>';
    data += '<h3>Steps:</h3>'
    data += '<p>';
    data += '<ol>';
    for (step of jsonData) {
        data += `<li>${step.title}</li>`;
    }
    data += '</ul>';
    data += '<p>';
    return data;
};

const parseExcelElement = async (elementData) => {
    try {
        const jsonData = JSON.parse(elementData.spread);
        var data = '<p>';
        data += '<h3>Excel:</h3>'
        data += '<p>';
        for (sheet of Object.keys(jsonData.sheets)) {
            var table = jsonData.sheets[sheet].data.dataTable;
            var input = []

            for (var i = 0; i < Object.keys(table).length; i++) {
                var row = {}
                for (var j = 0; j < Object.keys(table[i]).length; j++) {
                    if (!table[i][j]) {
                        row[j + 1] = '';
                    } else if (!table[i][j].value) {
                        row[j + 1] = '';
                    } else {
                        row[j + 1] = table[i][j].value;
                    }
                };
                input.push(row);
            };
            var tableified = tableify(input);
            data += tableified;
        };
        data += '<p>';
        return data;
    } catch (e) {
        console.log(e);
        return;
    };

};

module.exports = {
    parseSamplesElement,
    parseAttachmentsElement,
    parseStepsElement,
    parseExcelElement
};