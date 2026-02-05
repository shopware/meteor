import { GluegunCommand, GluegunToolbox } from 'gluegun'

const command: GluegunCommand = {
  name: '@shopware-ag/create-meteor-extension',
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
    const sourceDir = filesystem.path(__dirname, '..', 'templates', 'blank_project')
    const destinationDir = filesystem.path(filesystem.cwd(), name)

    // Validate source directory structure
    if (!filesystem.exists(sourceDir)) {
      print.error(`Error: Template directory not found at ${sourceDir}`)
      print.error('Please ensure the package is installed correctly.')
      return
    }

    // Validate that source directory has expected structure
    const requiredFiles = ['package.json.ejs', 'vite.config.ts', 'tsconfig.json']
    for (const file of requiredFiles) {
      const filePath = filesystem.path(sourceDir, file)
      if (!filesystem.exists(filePath)) {
        print.error(`Error: Required template file missing: ${file}`)
        print.error('Please ensure the package is installed correctly.')
        return
      }
    }

    // Check if the destination directory already exists
    if (filesystem.exists(destinationDir)) {
      print.error(`Error: Directory "${name}" already exists in the current location.`)
      print.info('Please choose a different name or remove the existing directory.')
      return
    }

    try {
      // Copy the template files from the source directory to the destination directory
      print.info(`Creating extension "${name}"...`)
      
      filesystem.copy(sourceDir, destinationDir, {
        overwrite: true,
      })

      // Look for all .ejs files in the destination directory
      const files = filesystem.find(destinationDir, {
        matching: '**/*.ejs',
        directories: false,
      })

      if (files.length === 0) {
        throw new Error('No template files (.ejs) found in the project structure')
      }

      // Generate files from the templates
      print.info('Processing templates...')
      const generationPromises = files.map(async (file) => {
        const destinationFile = file.replace(/\.ejs$/, '')

        try {
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
          await filesystem.removeAsync(file)
        } catch (error) {
          throw new Error(`Failed to process template ${file}: ${error.message}`)
        }
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
    } catch (error) {
      // Rollback: remove the destination directory if it was created
      print.newline()
      print.error(`Error creating extension: ${error.message}`)
      
      if (filesystem.exists(destinationDir)) {
        print.info('Rolling back changes...')
        try {
          await filesystem.removeAsync(destinationDir)
          print.info('Cleanup completed.')
        } catch (cleanupError) {
          print.warning(`Warning: Could not clean up directory ${destinationDir}`)
          print.warning('You may need to remove it manually.')
        }
      }
      
      print.newline()
      print.error('Extension creation failed. Please try again.')
    }
  },
}

module.exports = command
