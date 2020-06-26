const Spinner = require('cli-spinner').Spinner
const editJsonFile = require('edit-json-file');
const emoji = require('node-emoji')

const argv = require('yargs')
    .option('path', {
        alias: 'p',
        describe: 'Path to your project'
    })
    .demandOption(['path'], 'You must provide the path to your project.')
    .help()
    .argv

console.log(argv.path)

const spinner = new Spinner(emoji.get('coffee') + 'Processing... %s');
spinner.setSpinnerString('|/-\\')
spinner.start()


editPackageJson = (path) => {
    let file = editJsonFile(`${path}/package.json`);

    file.set("name", "Lulu")
    file.save()

    console.log(file.get());
}
