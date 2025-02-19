const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Get version from package.json
const packageJson = require('../../package.json')
const version = `v${packageJson.version}`

// Define paths
const tempBuildPath = path.join(__dirname, '../../storybook-static') // Storybook's default output folder
const publicRoot = path.join(__dirname, '../../public') // Store versions in public/
const finalBuildPath = path.join(publicRoot, version) // Versioned build location
const latestPath = path.join(publicRoot, 'latest')
const versionsFile = path.join(publicRoot, 'versions.json')
const indexHtmlFile = path.join(publicRoot, 'index.html')

// 🚀 Step 1: Ensure `public/` exists
if (!fs.existsSync(publicRoot)) {
  fs.mkdirSync(publicRoot, { recursive: true })
}

// 🚀 Step 2: Remove stale versions before regenerating `versions.json`
const existingVersions = fs
  .readdirSync(publicRoot)
  .filter(
    (name) =>
      name.startsWith('v') &&
      fs.lstatSync(path.join(publicRoot, name)).isDirectory()
  )

// 🚀 Step 3: Build Storybook in the default static folder
console.log(`🚀 Building Storybook for version ${version}...`)
execSync(`npx storybook build`, { stdio: 'inherit' })

// 🚀 Step 4: Move the build to `public/{version}`
if (fs.existsSync(finalBuildPath)) {
  fs.rmSync(finalBuildPath, { recursive: true, force: true })
}
fs.renameSync(tempBuildPath, finalBuildPath)

// 🚀 Step 5: Ensure "latest" is a symlink and not copied inside versions
if (fs.existsSync(latestPath)) {
  try {
    if (fs.lstatSync(latestPath).isSymbolicLink()) {
      fs.unlinkSync(latestPath)
    } else {
      fs.rmSync(latestPath, { recursive: true, force: true })
    }
  } catch (err) {
    console.error('⚠️ Error removing existing latest symlink:', err)
  }
}

if (!fs.existsSync(latestPath)) {
  fs.symlinkSync(finalBuildPath, latestPath, 'junction')
}

// 🚀 Step 6: Get the latest version list dynamically
const versions = fs
  .readdirSync(publicRoot)
  .filter(
    (name) =>
      name.startsWith('v') &&
      fs.lstatSync(path.join(publicRoot, name)).isDirectory()
  )
  .sort()
  .reverse() // Sort in descending order

// 🚀 Step 7: Write the updated `versions.json`
const versionsData = { latest: version, versions }
fs.writeFileSync(versionsFile, JSON.stringify(versionsData, null, 2))
console.log(`📄 Updated versions.json:`, versionsData)

// 🚀 Step 8: Auto-generate `index.html` to always redirect to the latest version
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

fs.writeFileSync(indexHtmlFile, indexHtmlContent)
console.log(`✅ Auto-generated index.html to redirect to /${version}/`)
console.log(`✅ Storybook built and moved to "${finalBuildPath}"`)
console.log(`🌐 Access latest: /latest/`)
console.log(`🌐 Access versions: /${version}/`)
console.log(`🌐 Versions list available at: /versions.json`)
console.log(`🌐 Homepage now auto-redirects to latest version`)

// const { execSync } = require('child_process')
// const fs = require('fs')
// const path = require('path')

// // Get version from package.json
// const packageJson = require('../../package.json')
// const version = `v${packageJson.version}`

// // Define paths
// const tempBuildPath = path.join(__dirname, '../../storybook-static') // Storybook's default output folder
// const publicRoot = path.join(__dirname, '../../public') // Store versions in public/
// const finalBuildPath = path.join(publicRoot, version) // Versioned build location
// const latestPath = path.join(publicRoot, 'latest')
// const versionsFile = path.join(publicRoot, 'versions.json')
// const indexHtmlFile = path.join(publicRoot, 'index.html')

// // 🚀 Step 1: Clean up previous builds before generating a new one
// if (fs.existsSync(tempBuildPath)) {
//   fs.rmSync(tempBuildPath, { recursive: true, force: true })
// }
// if (fs.existsSync(finalBuildPath)) {
//   fs.rmSync(finalBuildPath, { recursive: true, force: true })
// }

// // Ensure `public/` exists
// if (!fs.existsSync(publicRoot)) {
//   fs.mkdirSync(publicRoot, { recursive: true })
// }

// // 🚀 Step 2: Build Storybook in the default static folder
// console.log(`🚀 Building Storybook for version ${version}...`)
// execSync(`npx storybook build`, { stdio: 'inherit' })

// // 🚀 Step 3: Move the build to `public/{version}`
// fs.renameSync(tempBuildPath, finalBuildPath)

// // 🚀 Step 4: Ensure "latest" is a symlink but NOT copied inside versions
// if (fs.existsSync(latestPath)) {
//   try {
//     if (fs.lstatSync(latestPath).isSymbolicLink()) {
//       fs.unlinkSync(latestPath)
//     } else {
//       fs.rmSync(latestPath, { recursive: true, force: true })
//     }
//   } catch (err) {
//     console.error('⚠️ Error removing existing latest symlink:', err)
//   }
// }

// if (!fs.existsSync(latestPath)) {
//   fs.symlinkSync(finalBuildPath, latestPath, 'junction')
// }

// // 🚀 Step 5: Get all existing versions dynamically
// const versions = fs
//   .readdirSync(publicRoot)
//   .filter(
//     (name) =>
//       name.startsWith('v') &&
//       fs.lstatSync(path.join(publicRoot, name)).isDirectory()
//   )
//   .sort()
//   .reverse()

// // 🚀 Step 6: Write versions.json
// const versionsData = { latest: version, versions }
// fs.writeFileSync(versionsFile, JSON.stringify(versionsData, null, 2))
// console.log(`📄 Updated versions.json:`, versionsData)

// // 🚀 Step 7: Auto-generate index.html to redirect to the latest version
// const indexHtmlContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta http-equiv="refresh" content="0; URL=/${version}/">
//   <title>Redirecting...</title>
// </head>
// <body>
//   <script>
//     fetch("/versions.json")
//       .then(res => res.json())
//       .then(data => {
//         window.location.href = "/" + data.latest + "/";
//       })
//       .catch(() => {
//         window.location.href = "/latest/";
//       });
//   </script>
// </body>
// </html>
// `

// fs.writeFileSync(indexHtmlFile, indexHtmlContent)
// console.log(`✅ Auto-generated index.html to redirect to /${version}/`)
// console.log(`✅ Storybook built and moved to "${finalBuildPath}"`)
// console.log(`🌐 Access latest: /latest/`)
// console.log(`🌐 Access versions: /${version}/`)
// console.log(`🌐 Versions list available at: /versions.json`)
// console.log(`🌐 Homepage now auto-redirects to latest version`)

// const { execSync } = require('child_process')
// const fs = require('fs')
// const path = require('path')

// // Get version from package.json
// const packageJson = require('../../package.json')
// const version = `v${packageJson.version}`

// // Define paths
// const tempBuildPath = path.join(__dirname, '../../storybook-static') // Storybook's default output folder
// const publicRoot = path.join(__dirname, '../../public') // Store versions in public/
// const finalBuildPath = path.join(publicRoot, version) // Versioned build location
// const latestPath = path.join(publicRoot, 'latest')
// const versionsFile = path.join(publicRoot, 'versions.json')
// const indexHtmlFile = path.join(publicRoot, 'index.html')

// // 🚀 Step 1: Clean up previous build before generating a new one
// if (fs.existsSync(tempBuildPath)) {
//   fs.rmSync(tempBuildPath, { recursive: true, force: true })
// }

// // Ensure `public/` exists
// if (!fs.existsSync(publicRoot)) {
//   fs.mkdirSync(publicRoot, { recursive: true })
// }

// // 🚀 Step 2: Build Storybook in the default static folder
// console.log(`🚀 Building Storybook for version ${version}...`)
// execSync(`npx storybook build`, { stdio: 'inherit' })

// // 🚀 Step 3: Remove old version directory before moving new one
// if (fs.existsSync(finalBuildPath)) {
//   fs.rmSync(finalBuildPath, { recursive: true, force: true })
// }
// fs.renameSync(tempBuildPath, finalBuildPath) // ✅ Move instead of copy

// // 🚀 Step 4: Ensure "latest" is a symlink but NOT copied into version folders
// if (fs.existsSync(latestPath)) {
//   try {
//     // ✅ If latest is a symlink, remove it
//     if (fs.lstatSync(latestPath).isSymbolicLink()) {
//       fs.unlinkSync(latestPath)
//     } else {
//       // ✅ If latest is NOT a symlink, remove it completely (safety check)
//       fs.rmSync(latestPath, { recursive: true, force: true })
//     }
//   } catch (err) {
//     console.error('⚠️ Error removing existing latest symlink:', err)
//   }
// }

// // ✅ Create "latest" symlink ONLY if `finalBuildPath` exists
// if (fs.existsSync(finalBuildPath)) {
//   fs.symlinkSync(finalBuildPath, latestPath, 'junction')
// }

// // 🚀 Step 5: Get all existing versions dynamically (ignoring symlinks)
// const versions = fs
//   .readdirSync(publicRoot)
//   .filter(
//     (name) =>
//       name.startsWith('v') &&
//       fs.lstatSync(path.join(publicRoot, name)).isDirectory()
//   )
//   .sort()
//   .reverse() // Sort in descending order

// // 🚀 Step 6: Write versions.json
// const versionsData = { latest: version, versions }
// fs.writeFileSync(versionsFile, JSON.stringify(versionsData, null, 2))
// console.log(`📄 Updated versions.json:`, versionsData)

// // 🚀 Step 7: Auto-generate index.html to redirect to the latest version
// const indexHtmlContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta http-equiv="refresh" content="0; URL=/${version}/">
//   <title>Redirecting...</title>
// </head>
// <body>
//   <script>
//     fetch("/versions.json")
//       .then(res => res.json())
//       .then(data => {
//         window.location.href = "/" + data.latest + "/";
//       })
//       .catch(() => {
//         window.location.href = "/latest/";
//       });
//   </script>
// </body>
// </html>
// `

// fs.writeFileSync(indexHtmlFile, indexHtmlContent)
// console.log(`✅ Auto-generated index.html to redirect to /${version}/`)

// console.log(`✅ Storybook built and moved to "${finalBuildPath}"`)
// console.log(`🌐 Access latest: /latest/`)
// console.log(`🌐 Access versions: /${version}/`)
// console.log(`🌐 Versions list available at: /versions.json`)
// console.log(`🌐 Homepage now auto-redirects to latest version`)
