import { readFileSync } from 'fs'
import { join } from 'path'

const TEMPLATE_PATH = join(
  __dirname,
  '..',
  'src/templates/blank_project/package.json.ejs',
)

interface NpmLatestResponse {
  version: string
}

async function getLatestVersion(pkg: string): Promise<string> {
  const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`)
  if (!res.ok) {
    throw new Error(
      `Failed to fetch latest version for "${pkg}": HTTP ${res.status}`,
    )
  }
  const data = (await res.json()) as NpmLatestResponse
  return data.version
}

function parseMajor(versionRange: string): number {
  const clean = versionRange.replace(/^[^0-9]*/, '')
  return parseInt(clean.split('.')[0], 10)
}

test(
  'template package.json dependencies are not outdated by a major version',
  async () => {
    const raw = readFileSync(TEMPLATE_PATH, 'utf-8').replace(
      /<%= name %>/g,
      'test-placeholder',
    )
    const pkg = JSON.parse(raw) as {
      dependencies: Record<string, string>
      devDependencies: Record<string, string>
    }

    const allDeps: Record<string, string> = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    }

    const outdated: string[] = []

    await Promise.all(
      Object.entries(allDeps).map(async ([name, range]) => {
        const latestVersion = await getLatestVersion(name)
        const latestMajor = parseMajor(latestVersion)
        const templateMajor = parseMajor(range)

        if (latestMajor > templateMajor) {
          outdated.push(
            `${name}: template uses ^${templateMajor}.x but latest is v${latestVersion}`,
          )
        }
      }),
    )

    if (outdated.length > 0) {
      throw new Error(
        `The following packages in blank_project/package.json.ejs are outdated by a major version.\n` +
          `Please update the template:\n\n` +
          outdated.map((s) => `  - ${s}`).join('\n'),
      )
    }
  },
  30_000,
)
