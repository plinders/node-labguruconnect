const axios = require('axios');
const cheerio = require('cheerio');

/**
 * queryID - Queries an ID of anything on labguru after authentication
 *
 * @param {String} token
 * @param {String} type
 * @param {Number} id
 * @returns {Object} data of the query
 */
const queryID = async (server, token, type, id) => {
  var path = `/api/v1/${type}/${id}.json?token=${token}`;
  var query = server + path;

  const response = await axios.get(query);
  if (response.status !== 200) {
    throw new Error('Unable to connect to server.')
  } else {
    return response.data;
  };
};


const postItem = async (url, body, returnId) => {
  var response = await axios.post(url, body);

  if (response.status !== 201) {
    throw new Error('Post failed');
  } else {
    if (returnId) {
      return response.data.id;
    } else {
      return response.data;
    };
  };
};

const updateItem = async (url, body) => {
  const response = await axios.put(url, body);

  if (response.status !== 200) {
    throw new Error('PUT command failed');
  } else {
    return response.data;
  }
};

const deleteItem = async (url) => {
  const response = await axios.delete(url);

  return response;
}

/**
 * listItems - List items in e.g. a folder
 *
 * @param {String} url
 * @returns {Object} data of the query
 */
const listItems = async (url) => {

  const response = await axios.get(url);
  if (response.status !== 200) {
    throw new Error('Unable to connect to server.')
  } else {
    return response.data;
  };
};


/**
 * sanitizeFolderStructure - Helper function to return an object with only desired folder properties
 * Used to list all experiments in a folder and subfolders
 *
 * @param {Object} folder
 * @returns {Object} clean folder object
 */
const sanitizeFolderStructure = (folder) => {
  var folderId = folder.id;
  var folderTitle = folder.title;
  var experiments = folder.experiments;
  var subfolders = [];

  for (nestedFolder of folder.milestones) {
    try {
      var subfolder = sanitizeFolderStructure(nestedFolder);
      subfolders.push(subfolder);
    } catch (e) {
      console.log(e);
    };
  };

  if (folder.milestones.length > 0) {
    return {
      folderId,
      folderTitle,
      experiments,
      subfolders
    };
  } else {
    return {
      folderId,
      folderTitle,
      experiments
    }
  };
};

const htmlToFilepath = async (elementData) => {
  pathArr = []
  var $ = cheerio.load(elementData);

  $('a').each(function (i, link) {
    pathArr.push($(link).attr('href'))
  });

  return pathArr;
};

module.exports = {
  queryID,
  postItem,
  listItems,
  deleteItem,
  updateItem,
  sanitizeFolderStructure,
  htmlToFilepath
};