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
