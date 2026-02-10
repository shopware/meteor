import { GluegunCommand, GluegunToolbox } from 'gluegun'
import * as ejs from 'ejs'

const command: GluegunCommand = {
  name: '@shopware-ag/create-meteor-extension',
  run: async (toolbox: GluegunToolbox) => {
    const {
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
    const sourceDir = filesystem.path(
      __dirname,
      '..',
      'templates',
      'blank_project',
    )
    // The destination directory is always "meteor-app" for Shopware 6.7+ plugin structure
    const destinationDir = filesystem.path(filesystem.cwd(), 'meteor-app')

    // Validate source directory structure
    if (!filesystem.exists(sourceDir)) {
      print.error(`Error: Template directory not found at ${sourceDir}`)
      print.error('Please ensure the package is installed correctly.')
      return
    }

    // Validate that source directory has expected structure
    const requiredFiles = [
      'package.json.ejs',
      'vite.config.ts',
      'tsconfig.json',
    ]
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
      print.error(
        `Error: Directory "meteor-app" already exists in the current location.`,
      )
      print.info(
        'Please remove the existing directory or run this command in a different location.',
      )
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
        throw new Error(
          'No template files (.ejs) found in the project structure',
        )
      }

      // Process .ejs template files manually
      print.info('Processing templates...')
      for (const file of files) {
        try {
          const content = filesystem.read(file)
          const processed = ejs.render(content, { name })
          const targetFile = file.replace(/\.ejs$/, '')
          filesystem.write(targetFile, processed)
          filesystem.remove(file)
        } catch (error) {
          throw new Error(
            `Failed to process template ${file}: ${error.message}`,
          )
        }
      }

      // Print a success message
      print.newline()
      print.success(`Meteor extension "${name}" created successfully in "meteor-app" folder!`)
      print.newline()
      print.info(`To get started, run the following commands:

cd meteor-app
npm install   # or: pnpm install
npm run dev   # or: pnpm dev
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
          print.warning(
            `Warning: Could not clean up directory ${destinationDir}`,
          )
          print.warning('You may need to remove it manually.')
          print.info(`Run: rm -rf "${destinationDir}"`)
        }
      }

      print.newline()
      print.error('Extension creation failed. Please try again.')
    }
  },
}

module.exports = command
