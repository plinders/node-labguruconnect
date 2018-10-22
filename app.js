const yargs = require('yargs');
const fs = require('fs');

const connect = require('./main.js');
const credentials = require('./credentials.js')

const argv = yargs
    .options({
        e: {
            alias: 'experiment',
            'describe': 'Grab experiment by id as JSON',
            number: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

if (argv.experiment) {
    connect.pullExperiment(credentials.server, credentials.email, credentials.password, argv.experiment).then((obj) => {
        fs.writeFileSync(`${argv.experiment.toString()}.json`, JSON.stringify(obj, undefined, 2));
    })
}