const Spinner = require('cli-spinner').Spinner
const fs = require('fs')
const editJsonFile = require('edit-json-file');
const emoji = require('node-emoji')
const { exec } = require('child_process'); 
const chalk = require('chalk')
const { stderr } = require('process');

confirm = async(projectPath) => {
    fs.access(`${projectPath}`, function(error){
        if(error){
            console.log(chalk.red(`[---] The path you entered does not exist.`));   
            return 0
        } else {
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
            return configureFiles(projectPath)
        }
        spinner.stop()
        return configureFiles(projectPath)
    })
}

configureFiles = (projectPath) => {
    const spinner = new Spinner('\n' + emoji.get('coffee') + ' Configuring files... %s');
    spinner.setSpinnerString('|/-\\')
    spinner.start()

    const fileData = '@tailwind base;\n@tailwind components;\n@tailwind utilities;'
    const postcss = 'module.exports = {\n\tplugins: [\n\t\trequire(\'tailwindcss\'),\n\t\trequire(\'autoprefixer\'),\n\t],\n};'

    if(!fs.existsSync(`${projectPath}/src/styles`)){
        fs.mkdirSync(`${projectPath}/src/styles`)
    } 

    fs.writeFileSync(`${projectPath}/src/styles/index.css`, fileData)
    fs.writeFileSync(`${projectPath}/src/styles/tailwind.css`, null)

    if(fs.existsSync(`${projectPath}/postcss.config.js`)){
        fs.unlink(`${projectPath}/postcss.config.js`, (err) => {
            if(err){
                return console.log(err)
            }
        })
    } else{
        fs.writeFileSync(`${projectPath}/postcss.config.js`, postcss)
    }

    fs.readFile(`${projectPath}/src/index.js`, 'utf8', function read(err, data){
        if(err){
            console.log(emoji.get('flashlight') + ' Couldn\'t find ' + chalk.red('index.js'))
            console.log(emoji.get('flashlight') + ' Anyway! Use ' + chalk.blue('import \'./styles/tailwind.css\'') + 'where tailwind is needed.')
        } else{
            const content = data 
            const result = `import './styles/tailwind.css';\n${content}`
            fs.writeFileSync(`${projectPath}/src/index.js`, result)
        }
    })

    spinner.stop()
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
    console.log('\t' + 'Run: ' + chalk.blue('npm start'))
}

module.exports = {
    confirm,
    installPackages,
    configureFiles,
    editPackageJson
}
