const { execSync } = require('child_process')
const fs = require('fs').promises
const path = require('path')

const packageJson = require('../../package.json')
const version = `v${packageJson.version}`

const tempBuildPath = path.join(__dirname, '../../storybook-static')
const publicRoot = path.join(__dirname, '../../public')
const finalBuildPath = path.join(publicRoot, version)
const latestPath = path.join(publicRoot, 'latest')
const versionsFile = path.join(publicRoot, 'versions.json')
const indexHtmlFile = path.join(publicRoot, 'index.html')

const ensurePublicRoot = async () => {
  try {
    await fs.mkdir(publicRoot, { recursive: true })
  } catch (error) {
    console.error('❌ Failed to create public directory:', error.message)
    process.exit(1)
  }
}

const getExistingVersions = async () => {
  try {
    const items = await fs.readdir(publicRoot)
    return items
      .filter((name) => name.startsWith('v'))
      .filter(async (name) =>
        (await fs.lstat(path.join(publicRoot, name))).isDirectory()
      )
      .sort()
      .reverse()
  } catch (error) {
    console.error('⚠️ Failed to read existing versions:', error.message)
    return []
  }
}

const buildStorybook = () => {
  console.log(`🚀 Building Storybook for version ${version}...`)
  try {
    execSync('npx storybook build', { stdio: 'inherit' })
  } catch (error) {
    console.error('❌ Storybook build failed:', error.message)
    process.exit(1)
  }
}

const moveBuildToVersion = async () => {
  try {
    if (await fs.stat(finalBuildPath).catch(() => false)) {
      await fs.rm(finalBuildPath, { recursive: true, force: true })
    }
    await fs.rename(tempBuildPath, finalBuildPath)
    console.log(`✅ Storybook built and moved to "${finalBuildPath}"`)
  } catch (error) {
    console.error(`❌ Failed to move Storybook build: ${error.message}`)
    process.exit(1)
  }
}

const updateLatestSymlink = async () => {
  try {
    if (await fs.stat(latestPath).catch(() => false)) {
      const stats = await fs.lstat(latestPath)
      if (stats.isSymbolicLink()) {
        await fs.unlink(latestPath)
      } else {
        await fs.rm(latestPath, { recursive: true, force: true })
      }
    }
    await fs.symlink(finalBuildPath, latestPath, 'junction')
    console.log(`✅ Updated latest symlink to "${finalBuildPath}"`)
  } catch (error) {
    console.error(`⚠️ Failed to update latest symlink: ${error.message}`)
  }
}

const updateVersionsFile = async (versions) => {
  const versionsData = { latest: version, versions }
  try {
    await fs.writeFile(versionsFile, JSON.stringify(versionsData, null, 2))
    console.log(`📄 Updated versions.json:`, versionsData)
  } catch (error) {
    console.error('❌ Failed to update versions.json:', error.message)
  }
}

/**
 * Generates index.html for redirecting to the latest version.
 */
const generateIndexHtml = async () => {
  const indexHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; URL=/${version}/">
  <title>Redirecting...</title>
</head>
<body>
  <script>
    fetch("/versions.json")
      .then(res => res.json())
      .then(data => {
        window.location.href = "/" + data.latest + "/";
      })
      .catch(() => {
        window.location.href = "/latest/";
      });
  </script>
</body>
</html>
`

  try {
    await fs.writeFile(indexHtmlFile, indexHtmlContent)
    console.log(`✅ Auto-generated index.html to redirect to /${version}/`)
  } catch (error) {
    console.error('❌ Failed to create index.html:', error.message)
  }
}

const main = async () => {
  await ensurePublicRoot()
  buildStorybook()
  await moveBuildToVersion()
  await updateLatestSymlink()

  const versions = await getExistingVersions()
  await updateVersionsFile(versions)
  await generateIndexHtml()

  console.log(`🌐 Access latest: /latest/`)
  console.log(`🌐 Access versions: /${version}/`)
  console.log(`🌐 Versions list available at: /versions.json`)
  console.log(`🌐 Homepage now auto-redirects to latest version`)
}

main()
