# node-labguruConnect

node-labguruConnect leverages the Labguru API to allow scripting. Main features include:

* Pulling an experiment & all its attachments. Experiment body will be output as a .json file, all attachments will be placed in a new folder with the same name as the experiment. This .json can subsequently be used with [node-labguruMD](https://github.com/plinders/node-labgurumd) to produce Markdown documents.
* Pushing an experiment & all its attachments to Labguru.
* Listing all experiment of a certain project with only useful info (nesting of subfolders, experiment ID, title)

## Getting Started

### Prerequisites

Node >v8.

### Installing


```
git@github.com:plinders/node-labguruconnect.git
npm i
```

### Running

**Usage:**

First, create a credentials file. This will simplify all subsequent API steps. 

JS example:

```js
var credentials = {
  email: '<your email>',
  password: '<your email>',
  server: '<your labguru server>'
};

module.exports = credentials;

```

Next, until I've worked on a decent frontend, this is how I use node-labguruConnect. I'll make a new script file with the commands I need to perform. An example for pulling an experiment in JS:

```js
const main = require('./main.js');
const credentials = require('./credentials.js');

const fs = require('fs');

main.pullExperiment(credentials.server, credentials.email, credentials.password, <id>).then((obj) => {
    fs.writeFileSync('<id>.json', JSON.stringify(obj, undefined, 2));
});
```


## Authors

* **Peter Linders** - *Initial work* - [plinders](https://github.com/plinders)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Labguru team for the API and code examples: 
    * [Biodata/labguru-api-examples](https://github.com/BioData/labguru-api-examples)
    * [BioData/LabguruR](https://github.com/BioData/LabguruR)

## Todo

* Finish all API functions
* Better error handling
* Express app?
* Tests