const Spinner = require('cli-spinner').Spinner
const fs = require('fs')
const editJsonFile = require('edit-json-file');
const emoji = require('node-emoji')
const { exec } = require('child_process'); 
const chalk = require('chalk')
const { stderr } = require('process');

const argv = require('yargs')
    .option('path', {
        alias: 'p',
        describe: 'Path to your project'
    })
    .demandOption(['path'], 'You must provide the path to your project.')
    .help()
    .argv


let projectPath = argv.path

confirm = () => {
    fs.access(`${projectPath}`, function(error){
        if(error){
            console.log(chalk.red(`[---] ${projectPath} does not exist.`))
            return;
        }
        else {
            installPackages(projectPath)
        }
    })
}

installPackages = (projectPath) => {
    const spinner = new Spinner(emoji.get('coffee') + ' Installing required packages... %s');
    spinner.setSpinnerString('|/-\\')
    spinner.start()
    exec(`npm install tailwindcss postcss-cli autoprefixer postcss-import --save-dev`, {cwd: `${projectPath}`}, (error, stdout, stderr) => {
        if (error) {
            spinner.stop()
            console.log(`\n${error.message}`);
            return;
        }
        if (stderr) {
            spinner.stop()
            // console.log(`\n${stderr}`);
            return configureFiles(projectPath)
        }
        spinner.stop()
        console.log('\n[+] Done')
        return configureFiles(projectPath)
        // console.log(`\n${stdout}`);
    })
}


configureFiles = (projectPath) => {
    const spinner = new Spinner('\n' + emoji.get('coffee') + ' Configuring files... %s');
    spinner.setSpinnerString('|/-\\')
    spinner.start()

    const fileData = '@tailwind base;\n@tailwind components;\n@tailwind utilities;'
    const postcss = 'module.exports = {\n\tplugins: [\n\t\trequire(\'tailwindcss\'),\n\t\trequire(\'autoprefixer\'),\n\t],\n};'

    fs.mkdirSync(`${projectPath}/src/styles`)

    fs.writeFileSync(`${projectPath}/src/styles/index.css`, fileData)
    fs.writeFileSync(`${projectPath}/src/styles/tailwind.css`, null)
    fs.writeFileSync(`${projectPath}/postcss.config.js`, postcss)

    spinner.stop()
    console.log('\n[+] Done')
    editPackageJson(projectPath)
}

editPackageJson = (projectPath) => {
    const spinner = new Spinner(emoji.get('coffee') + ' Modifying package.json... %s');
    spinner.setSpinnerString('|/-\\')
    spinner.start()

    let file = editJsonFile(`${projectPath}/package.json`);

    file.set("scripts.start", "npm run build:style && react-scripts start")
    file.set("scripts.build:style", "tailwind build src/styles/index.css -o src/styles/tailwind.css --watch")
    file.save()
    spinner.stop()

    console.log('\n' + emoji.get('tophat') + ' Tailwind configured successfully.')
    console.log('\n' + emoji.get('sparkles') + chalk.blue(' run: npm start'))
}

confirm(projectPath)
