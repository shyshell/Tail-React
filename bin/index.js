#!/usr/bin/env node

const tailReact = require('../lib/tail-react.js')
const argv = require('yargs')
    .option('path', {
        alias: 'p',
        describe: 'Path to your project'
    })
    .demandOption(['path'], 'You must provide the path to your project.')
    .help()
    .argv

const execute = async(path) => {
    try {
        await tailReact.confirm(path)
    } catch (e) {
        return
    }
}

if(argv.path == "."){
    let projectPath = `${process.cwd()}`
    execute(projectPath)
} else {
    let projectPath = argv.path 
    execute(projectPath)
}

    


