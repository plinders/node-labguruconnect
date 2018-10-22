const auth = require('./auth.js');
const api = require('./api.js');
const helper = require('./helper.js');
const parse = require('./parse.js');


const fs = require('fs');

// thanks James!
const pullExperiment = async (server, email, password, id) => {
    const token = await auth.authenticate(server, email, password);
    const experiment = await api.getExperiment(server, token, id);

    var title = experiment.title;

    var methods = [];

    // Methods consist of multiple sections
    for (const item of experiment.experiment_procedures) {
        var content = [];

        // Each section of experiment procedures might contain more than one element (text, steps, etc.)
        for (const element of item.experiment_procedure.elements) {
            const contents = await api.getElement(server, token, element.id);

            const elementType = contents.element_type;

            switch (true) {
                case elementType === "samples":
                    var data = await parse.parseSamplesElement(contents.data);
                    break;
                case elementType === "attachments":
                    var data = await parse.parseAttachmentsElement(server, token, contents.data, title);
                    break;
                case elementType === "steps":
                    var data = await parse.parseStepsElement(contents.data);
                    break;
                case elementType === "excel":
                    var data = await parse.parseExcelElement(contents.data);
                    break;
                default:
                    var data = contents.data;
            }

            var contentObj = {
                'position': contents.position,
                'type': contents.element_type,
                'containerType': contents.container_type,
                'fieldName': contents.field_name,
                'data': data
            };
            content.push(contentObj);
        };
        var section = {
            'sectionName': item.experiment_procedure.name,
            'sectionType': item.experiment_procedure.section_type,
            'elements': content
        };
        methods.push(section);
    };

    var experimentDoc = {
        id: id,
        title: title,
        'procedures': methods
    };

    return experimentDoc;

    // console.log(JSON.stringify(experimentDoc, undefined, 2));
};


const listAllExperiments = async (server, email, password, folder) => {
    const token = await auth.authenticate(server, email, password);
    const folderContents = await api.getFolder(server, token, folder);

    var allFolders = [];
    for (const folder of folderContents.milestones) {
        allFolders.push(helper.sanitizeFolderStructure(folder));
    };

    var allExperiments = [];
    for (const experimentFolder of allFolders) {
        for (const experiment of experimentFolder.experiments) {
            var res = await pullExperiment(server, email, password, experiment.id);
            allExperiments.push(res);
        }
    }

    return allExperiments;
};


const pushExperiment = async (server, email, password, expJSON, project_id, milestone_id) => {
    const token = await auth.authenticate(server, email, password);
    var expBody = {
        "item": {
            "title": expJSON.title,
            project_id,
            milestone_id
        },
        token
    };

    const exp = await api.postExperiment(server, expBody, false);

    for (const oldProcedure of exp.experiment_procedures) {
        api.deleteExperimentProcedure(server, token, oldProcedure.experiment_procedure.id);
    };


    for (const procedure of expJSON.procedures) {
        const procedureID = await api.postExperimentProcedure(server, token, procedure.sectionName, exp.id, true);


        for (const element of procedure.elements) {
            switch (true) {
                case element.type === "attachments":
                    var elementID = await api.postAttachment(server, token, element.data, exp.uuid, procedureID)
                    break;
                default:
                    var elementID = await api.postElement(server, token, element.data, procedureID, true);
            }

        };
    };
};

module.exports = {
    pullExperiment,
    listAllExperiments,
    pushExperiment
};