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

if(argv.path == "."){
    console.log(`The path is ${process.cwd()}`)
    let projectPath = `${process.cwd()}`
    tailReact.confirm(projectPath)
} else {
    let projectPath = argv.path 
    tailReact.confirm(projectPath)
}
    


