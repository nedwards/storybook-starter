const { execSync, exec } = require('child_process')
const fs = require('fs')
const path = require('path')

// Define the public folder (where Storybook versions are stored)
const publicRoot = path.join(__dirname, '../../public')
const versionsFile = path.join(publicRoot, 'versions.json')

// Read latest version from versions.json
let latestVersion = 'latest'
if (fs.existsSync(versionsFile)) {
  try {
    const versionsData = JSON.parse(fs.readFileSync(versionsFile, 'utf-8'))
    latestVersion = versionsData.latest
    console.log(`📌 Latest Storybook version: ${latestVersion}`)
  } catch (error) {
    console.error(
      '⚠️ Error reading versions.json, defaulting to latest:',
      error
    )
  }
} else {
  console.error('❌ Error: versions.json not found!')
  process.exit(1)
}

// Ensure latest version exists
const latestPath = path.join(publicRoot, latestVersion)
if (!fs.existsSync(latestPath)) {
  console.error(
    `❌ Error: Latest version folder "${latestVersion}" does not exist.`
  )
  process.exit(1)
}

// Serve the entire `public/` folder so all versions are accessible
console.log(`🚀 Serving ALL Storybook versions from ${publicRoot}`)

const serverProcess = exec(
  `npx http-server -p 6006 ${publicRoot} --cors`,
  (error) => {
    if (error) {
      console.error(`❌ Error starting server: ${error}`)
      process.exit(1)
    }
  }
)

// 🚀 Auto-open Storybook in the browser after a short delay
const openBrowser = (url) => {
  const platform = process.platform
  if (platform === 'darwin') {
    exec(`open ${url}`) // macOS
  } else if (platform === 'win32') {
    exec(`start ${url}`) // Windows
  } else {
    exec(`xdg-open ${url}`) // Linux
  }
}

// Wait a moment for the server to start before opening the browser
setTimeout(() => {
  const storybookUrl = `http://127.0.0.1:6006/${latestVersion}/`
  console.log(`🌍 Opening Storybook: ${storybookUrl}`)
  openBrowser(storybookUrl)
}, 3000) // Delay to allow server startup
