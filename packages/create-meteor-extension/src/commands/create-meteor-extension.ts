import { GluegunCommand, GluegunToolbox } from 'gluegun'

const command: GluegunCommand = {
  name: 'create-meteor-extension',
  run: async (toolbox: GluegunToolbox) => {
    const {
      template: { generate },
      print,
      prompt,
      parameters,
      filesystem,
    } = toolbox

    const { name } = await prompt.ask({
      type: 'input',
      name: 'name',
      initial: parameters.first,
      message: 'What is the name of your Meteor extension?',

      validate: (input: string) => {
        if (!input) {
          return 'Name cannot be empty'
        }

        // Name can only contain lowercase letters, numbers, and hyphens
        const regex = /^[a-z0-9-]+$/
        if (!regex.test(input)) {
          return 'Name can only contain lowercase letters, numbers, and hyphens'
        }

        return true
      },
    })

    // Define the source and destination directories
    const sourceDir = filesystem.path('./src/templates/blank_project')
    const destinationDir = filesystem.path(filesystem.cwd(), name)

    // Ensure that the source directory exists
    if (!filesystem.exists(sourceDir)) {
      print.error(`Source directory ${sourceDir} does not exist`)
      return
    }

    // Check if the destination directory already exists
    if (filesystem.exists(destinationDir)) {
      print.error(`Destination directory ${destinationDir} already exists`)
      return
    }

    // Copy the template files from the source directory to the destination directory
    filesystem.copy(sourceDir, destinationDir, {
      overwrite: true,
    })

    // Look for all .ejs files in the destination directory
    const files = filesystem.find(destinationDir, {
      matching: '*.ejs',
      directories: false,
    })

    // Generate files from the templates
    const generationPromises = files.map(async (file) => {
      const destinationFile = file.replace(/\.ejs$/, '')

      await generate({
        // Go to the parent directory of the destination file because the destination file contains the name of the extension
        directory: filesystem.path(destinationDir, '..'),
        template: file,
        target: destinationFile,
        props: {
          name,
        },
      })

      // Remove the original .ejs file
      filesystem.removeAsync(file)
    })

    // Wait for all file generation to complete
    await Promise.all(generationPromises)

    // Print a success message
    print.newline()
    print.success(`Meteor extension "${name}" created successfully!`)
    print.newline()
    print.info(`To get started, run the following commands:

cd ${name}
npm install
npm run dev
`)
  },
}

module.exports = command
