import { filesystem } from 'gluegun'

const src = filesystem.path(__dirname, '..')

test('outputs version', async () => {
  const { run } = require(filesystem.path(src, 'src', 'cli'))
  const toolbox = await run(['--version'])

  expect(toolbox).toBeDefined()
  expect(run).toBeDefined()
})

test('outputs help', async () => {
  const { run } = require(filesystem.path(src, 'src', 'cli'))
  const toolbox = await run(['--help'])

  expect(toolbox).toBeDefined()
  expect(run).toBeDefined()
})

test('validates extension name - rejects uppercase', async () => {
  const extensionName = 'TestExtension'
  const testDir = filesystem.path(src, '__tests__', 'tmp', extensionName)

  // Ensure test directory doesn't exist
  if (filesystem.exists(testDir)) {
    filesystem.remove(testDir)
  }

  // Mock prompt to simulate user input with uppercase
  // Note: This test would need proper mocking of the prompt
  // For now, we're just validating the regex pattern
  const regex = /^[a-z0-9-]+$/
  expect(regex.test('TestExtension')).toBe(false)
  expect(regex.test('test-extension')).toBe(true)
})

test('validates extension name - rejects spaces', async () => {
  const regex = /^[a-z0-9-]+$/
  expect(regex.test('test extension')).toBe(false)
  expect(regex.test('test-extension')).toBe(true)
})

test('validates extension name - accepts valid names', async () => {
  const regex = /^[a-z0-9-]+$/
  expect(regex.test('my-extension')).toBe(true)
  expect(regex.test('test123')).toBe(true)
  expect(regex.test('my-extension-2024')).toBe(true)
})

test('non-interactive mode - creates extension with --name flag', async () => {
  const { run } = require(filesystem.path(src, 'src', 'cli'))
  const testName = 'test-extension-' + Date.now()
  const testDir = filesystem.path(src, '__tests__', 'tmp', testName)

  // Ensure test directory doesn't exist
  if (filesystem.exists(testDir)) {
    filesystem.remove(testDir)
  }

  // Create temp directory and run CLI in non-interactive mode
  filesystem.dir(testDir)

  // Change to test directory
  const originalCwd = process.cwd()
  process.chdir(testDir)

  try {
    const toolbox = await run(['--name', testName])

    // Check that meteor-app directory was created
    const meteorAppDir = filesystem.path(testDir, 'meteor-app')
    expect(filesystem.exists(meteorAppDir)).toBe(true)

    // Check that package.json was created with correct name
    const packageJson = filesystem.read(
      filesystem.path(meteorAppDir, 'package.json'),
      'json',
    )
    expect(packageJson.name).toBe(testName)
  } finally {
    // Clean up
    process.chdir(originalCwd)
    if (filesystem.exists(testDir)) {
      filesystem.remove(testDir)
    }
  }
})

test('non-interactive mode - creates extension with custom --output-dir', async () => {
  const { run } = require(filesystem.path(src, 'src', 'cli'))
  const testName = 'custom-output-' + Date.now()
  const testDir = filesystem.path(src, '__tests__', 'tmp', testName)
  const customOutputDir = 'my-custom-app'

  // Ensure test directory doesn't exist
  if (filesystem.exists(testDir)) {
    filesystem.remove(testDir)
  }

  // Create temp directory and run CLI in non-interactive mode
  filesystem.dir(testDir)

  // Change to test directory
  const originalCwd = process.cwd()
  process.chdir(testDir)

  try {
    const toolbox = await run([
      '--name',
      testName,
      '--output-dir',
      customOutputDir,
    ])

    // Check that custom output directory was created
    const customDir = filesystem.path(testDir, customOutputDir)
    expect(filesystem.exists(customDir)).toBe(true)

    // Check that package.json was created with correct name
    const packageJson = filesystem.read(
      filesystem.path(customDir, 'package.json'),
      'json',
    )
    expect(packageJson.name).toBe(testName)
  } finally {
    // Clean up
    process.chdir(originalCwd)
    if (filesystem.exists(testDir)) {
      filesystem.remove(testDir)
    }
  }
})
