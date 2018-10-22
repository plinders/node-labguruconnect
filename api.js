const helper = require('./helper.js');
const fileOps = require('./file_operations.js');

const axios = require('axios');

/**
 * listFolders - Returns a list of folders of a project
 *
 * @param {String} server
 * @param {String} token
 * @param {Number} [projectID=undefined]
 * @param {Number} [page=1]
 * @returns {Object} All folders relating to projectID
 */
const listFolders = async (server, token, projectID = undefined, page = 1) => {
  var path = `/api/v1/milestones/?token=${token}&page=${page}`;
  var query = server + path;
  const folderList = await helper.listItems(query);
  return folderList;
};


/**
 * getFolder - Returns folder contents for a given folder id
 *
 * @param {String} server
 * @param {String} token
 * @param {Number} id
 * @returns {Object} Contents of queried folder
 */
const getFolder = async (server, token, id) => {
  const folder = await helper.queryID(server, token, "milestones", id);
  return folder;
};

/**
 * getExperiment - Returns experiment contents for given experiment id
 *
 * @param {String} server
 * @param {String} token
 * @param {Number} id
 * @returns {Object} Contents of queried experiment
 */
const getExperiment = async (server, token, id) => {
  const experiment = await helper.queryID(server, token, "experiments", id);
  return experiment;
};

/**
 * getExperimentProcedure - Returns experiment procedure contents for given procedure id
 * Note that this is different from labguruGetExperiment, seperate IDs
 * 
 * @param {String} server
 * @param {String} token
 * @param {Number} id
 * @returns {Object} Contents of queried experiment procedure
 */
const getExperimentProcedure = async (server, token, id) => {
  const procedure = await helper.queryID(server, token, "element_containers", id);
  return procedure;
};

/**
 * getExperimentProcedure - Returns element contents for given element id
 * Note that this is different from labguruGetExperiment, seperate IDs
 * 
 * @param {String} server
 * @param {String} token
 * @param {Number} id
 * @returns {Object} Contents of queried element
 */
const getElement = async (server, token, id) => {
  const element = await helper.queryID(server, token, "elements", id);
  return element;
};

/**
 * listProjects - Collects list of available projects
 *
 * @param {String} server
 * @param {String} token
 * @param {Number} [page=1]
 * @returns {Object} Contents of queried page
 */
const listProjects = async (server, token, page = 1) => {
  var path = `/api/v1/projects/?token=${token}&page=${page}`;
  var query = server + path;
  const projectList = await helper.listItems(query);
  return projectList;
};

/**
 * getProject - Grabs project by id
 *
 * @param {String} server
 * @param {String} token
 * @param {Number} id
 * @returns {Object} Contents of queried project id
 */
const getProject = async (server, token, id) => {
  const project = await helper.queryID(server, token, type = "projects", id = id);
  return project;
};


const postExperiment = async (server, body, returnId) => {
  var url = `${server}/api/v1/experiments.json`;

  const response = await helper.postItem(url, body, returnId);
  return response;
};


const postExperimentProcedure = async (server, token, name, experimentId, returnId) => {
  var url = `${server}/api/v1/sections`;
  var body = {
    "item": {
      name,
      "container_id": experimentId,
      "container_type": "Projects::Experiment"
    },
    token
  };

  const response = await helper.postItem(url, body, returnId);
  return response;
}

const deleteExperimentProcedure = async (server, token, procedureId) => {
  var url = `${server}/api/v1/sections/${procedureId}.json?token=${token}`;
  // var body = {
  //   token
  // };

  const response = await helper.deleteItem(url);
  return response;
}

const postElement = async (server, token, data, procedureId, returnId) => {
  var url = `${server}/api/v1/elements`;
  var body = {
    "item": {
      data,
      "container_id": procedureId,
      "container_type": "ExperimentProcedure",
      "element_type": "text"
    },
    token
  };
  const response = await helper.postItem(url, body, returnId);
  return response;
};

const updateElement = async (server, token, data, elementId) => {
  var url = `${server}/api/v1/elements/${elementId}.json`;
  var body = {
    "item": {
      item
    },
    token
  };
  const response = await helper.updateItem(url, body);
  return response;
}


const getAttachment = async (server, token, id) => {
  const attachment = await helper.queryID(server, token, type = "attachments", id = id);
  return attachment;
};

const postAttachment = async (server, token, data, uuid, procedureId) => {
  const files = await helper.htmlToFilepath(data);

  var uploadedFiles = [];
  for (file of files) {
    var uploadedFile = await fileOps.uploadFile(server, token, file, uuid);
    uploadedFiles.push(uploadedFile);
  }

  var url = `${server}/api/v1/elements.json`;
  var body = {
    "item": {
      "element_type": "attachments",
      "data": JSON.stringify(uploadedFiles),
      "container_id": procedureId,
      "container_type": "ExperimentProcedure"
    },
    token
  };
  const attachmentElement = await helper.postItem(url, body, false);

  for (uploaded of uploadedFiles) {
    var attachmentUrl = `${server}/api/v1/attachments/${uploaded.id}.json`
    const response = await axios.put(attachmentUrl, {
      token,
      item: {
        element_id: attachmentElement.id
      }
    });
  };
};

module.exports = {
  listFolders,
  getFolder,
  getExperiment,
  getExperimentProcedure,
  listProjects,
  getProject,
  getElement,
  postExperiment,
  postExperimentProcedure,
  deleteExperimentProcedure,
  postElement,
  getAttachment,
  postAttachment
};