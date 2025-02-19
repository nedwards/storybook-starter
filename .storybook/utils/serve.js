const { spawn, execFile } = require('child_process')
const fs = require('fs').promises
const path = require('path')

const PORT = process.env.PORT || 6006
const DELAY = 3000
const publicRoot = path.join(__dirname, '../../public')
const versionsFile = path.join(publicRoot, 'versions.json')

const getLatestVersion = async () => {
  try {
    const data = await fs.readFile(versionsFile, 'utf-8')
    const versionsData = JSON.parse(data)
    console.log(`📌 Latest Storybook version: ${versionsData.latest}`)
    return versionsData.latest || 'latest'
  } catch (error) {
    console.error(
      '⚠️ Error reading versions.json, defaulting to latest:',
      error.message
    )
    return 'latest'
  }
}

const openBrowser = (url) => {
  const platform = process.platform
  const commands = {
    darwin: 'open', // macOS
    win32: 'start', // Windows
    linux: 'xdg-open', // Linux
  }

  const command = commands[platform]
  if (command) {
    execFile(command, [url], (error) => {
      if (error) {
        console.error(`⚠️ Failed to open browser: ${error.message}`)
      }
    })
  } else {
    console.error('⚠️ Unsupported platform: Cannot open browser.')
  }
}

const startServer = () => {
  console.log(
    `🚀 Serving ALL Storybook versions from ${publicRoot} on port ${PORT}`
  )
  const server = spawn(
    'npx',
    ['http-server', '-p', PORT, publicRoot, '--cors'],
    {
      stdio: 'inherit',
      shell: true,
    }
  )

  server.on('error', (error) => {
    console.error(`❌ Server error: ${error.message}`)
    process.exit(1)
  })

  process.on('SIGINT', () => {
    console.log('\n🛑 Server shutting down gracefully...')
    server.kill()
    process.exit(0)
  })

  return server
}

;(async () => {
  const latestVersion = await getLatestVersion()
  const latestPath = path.join(publicRoot, latestVersion)

  if (!(await fs.stat(latestPath).catch(() => false))) {
    console.error(
      `❌ Error: Latest version folder "${latestVersion}" does not exist.`
    )
    process.exit(1)
  }

  startServer()

  setTimeout(() => {
    const storybookUrl = `http://127.0.0.1:${PORT}/${latestVersion}/`
    console.log(`🌍 Opening Storybook: ${storybookUrl}`)
    openBrowser(storybookUrl)
  }, DELAY)
})()
