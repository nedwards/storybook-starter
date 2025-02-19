import { addons } from '@storybook/manager-api'
import React, { useState, useEffect } from 'react'

// ✅ Detect if we are running Storybook in development mode
const isDevMode =
  window.location.hostname === 'localhost' && window.location.port === '6006'
const versionsJsonUrl = '/versions.json?t=' + new Date().getTime()

const VersionSwitcher = () => {
  const [versions, setVersions] = useState([])
  const [latestVersion, setLatestVersion] = useState('loading...')
  const [selectedVersion, setSelectedVersion] = useState('')

  useEffect(() => {
    fetch(versionsJsonUrl)
      .then((res) => res.json())
      .then((data) => {
        const allVersions = ['latest', ...data.versions] // ✅ Ensure "latest" is included
        setVersions(allVersions)
        setLatestVersion(data.latest || 'unknown') // ✅ Show actual latest version

        // ✅ Detect the current version from the URL
        const urlSegments = window.location.pathname.split('/')
        const currentVersion = urlSegments[1]

        // ✅ Ensure "latest" is mapped correctly and persists
        setSelectedVersion(
          currentVersion === 'latest' ? 'latest' : currentVersion
        )
      })
      .catch((err) => {
        console.error('🚨 Error loading versions.json:', err)
        setLatestVersion('error')
      })
  }, [])

  if (isDevMode) {
    // ✅ Show actual latest version number in dev mode instead of dropdown
    return (
      <span
        style={{
          fontSize: '13px',
          fontWeight: 600,
        }}
      >
        {latestVersion}
      </span>
    )
  }

  return versions.length > 0 ? (
    <select
      value={selectedVersion}
      onChange={(event) => {
        let version = event.target.value
        setSelectedVersion(version)
        localStorage.setItem('storybook-version', version)

        // ✅ Preserve `?path=` query parameter
        const searchParams = new URLSearchParams(window.location.search)
        const storyPath = searchParams.has('path')
          ? `?path=${searchParams.get('path')}`
          : ''

        // ✅ Redirect logic for selecting latest or other versions
        const redirectUrl =
          version === 'latest'
            ? `/latest/${storyPath}`
            : `/${version}/index.html${storyPath}`

        console.log(`🔄 Redirecting to: ${redirectUrl}`)
        window.location.href = redirectUrl
      }}
      style={{
        padding: '0',
        borderRadius: '0',
        fontSize: '13px',
        borderColor: 'rgb(115, 130, 140)',
        minWidth: '80px',
        backgroundColor: '#fff',
      }}
    >
      {versions.map((ver) => (
        <option key={ver} value={ver}>
          {ver === 'latest' ? 'Latest' : ver}
        </option>
      ))}
    </select>
  ) : (
    <span style={{ color: 'red' }}>⚠️ No versions found</span>
  )
}

// ✅ Register the addon
addons.register('storybook/version-switcher', () => {
  addons.add('storybook/version-switcher/tool', {
    title: 'Version Switcher',
    type: 'tool',
    render: () => <VersionSwitcher />,
  })
})

// import { addons } from '@storybook/manager-api'
// import React, { useState, useEffect } from 'react'

// // ✅ Detect if we are running Storybook in development mode
// const isDevMode =
//   window.location.hostname === 'localhost' && window.location.port === '6006'
// const versionsJsonUrl = '/versions.json?t=' + new Date().getTime()

// const VersionSwitcher = () => {
//   const [versions, setVersions] = useState([])
//   const [latestVersion, setLatestVersion] = useState('loading...')
//   const [selectedVersion, setSelectedVersion] = useState('')

//   useEffect(() => {
//     fetch(versionsJsonUrl)
//       .then((res) => res.json())
//       .then((data) => {
//         const allVersions = ['latest', ...data.versions] // ✅ Ensure "latest" is included
//         setVersions(allVersions)
//         setLatestVersion(data.latest || 'unknown') // ✅ Show actual latest version
//         setSelectedVersion(data.latest || 'latest') // ✅ Default to actual latest version
//       })
//       .catch((err) => {
//         console.error('🚨 Error loading versions.json:', err)
//         setLatestVersion('error')
//       })
//   }, [])

//   if (isDevMode) {
//     // ✅ Show actual latest version number in dev mode instead of dropdown
//     return (
//       <span
//         style={{
//           fontSize: '13px',
//           padding: '4px 10px',
//           backgroundColor: '#f3f3f3',
//           borderRadius: '5px',
//           border: '1px solid #ccc',
//           display: 'inline-block',
//           marginLeft: '10px',
//         }}
//       >
//         Current Version: {latestVersion}
//       </span>
//     )
//   }

//   return versions.length > 0 ? (
//     <select
//       value={selectedVersion}
//       onChange={(event) => {
//         const version = event.target.value
//         setSelectedVersion(version)
//         localStorage.setItem('storybook-version', version)

//         // ✅ Preserve `?path=` query parameter
//         const searchParams = new URLSearchParams(window.location.search)
//         const storyPath = searchParams.has('path')
//           ? `?path=${searchParams.get('path')}`
//           : ''

//         // ✅ Redirect logic for selecting latest or other versions
//         const redirectUrl =
//           version === 'latest'
//             ? `/latest/${storyPath}`
//             : `/${version}/index.html${storyPath}`

//         console.log(`🔄 Redirecting to: ${redirectUrl}`)
//         window.location.href = redirectUrl
//       }}
//       style={{
//         padding: '0',
//         borderRadius: '0',
//         fontSize: '13px',
//         borderColor: 'rgb(115, 130, 140)',
//         minWidth: '80px',
//         backgroundColor: '#fff',
//       }}
//     >
//       {versions.map((ver) => (
//         <option key={ver} value={ver}>
//           {ver === 'latest' ? `Latest (${latestVersion})` : ver}
//         </option>
//       ))}
//     </select>
//   ) : (
//     <span style={{ color: 'red' }}>⚠️ No versions found</span>
//   )
// }

// // ✅ Register the addon
// addons.register('storybook/version-switcher', () => {
//   addons.add('storybook/version-switcher/tool', {
//     title: 'Version Switcher',
//     type: 'tool',
//     render: () => <VersionSwitcher />,
//   })
// })

// import { addons } from '@storybook/manager-api'
// import React, { useState, useEffect } from 'react'

// // ✅ Detect if we are running Storybook in development mode
// const isDevMode =
//   window.location.hostname === 'localhost' && window.location.port === '6006'
// const versionsJsonUrl = '/versions.json?t=' + new Date().getTime()

// const VersionSwitcher = () => {
//   const [versions, setVersions] = useState([])
//   const [latestVersion, setLatestVersion] = useState('loading...')

//   useEffect(() => {
//     fetch(versionsJsonUrl)
//       .then((res) => res.json())
//       .then((data) => {
//         const allVersions = ['latest', ...data.versions] // ✅ Ensure "latest" is included
//         setVersions(allVersions)
//         setLatestVersion(data.latest || 'unknown') // ✅ Show actual latest version
//       })
//       .catch((err) => {
//         console.error('🚨 Error loading versions.json:', err)
//         setLatestVersion('error') // If fetch fails, show "error"
//       })
//   }, [])

//   if (isDevMode) {
//     // ✅ Show actual latest version number in dev mode instead of dropdown
//     return (
//       <span
//         style={{
//           fontSize: '13px',
//           fontWeight: 600,
//         }}
//       >
//         {latestVersion}
//       </span>
//     )
//   }

//   return versions.length > 0 ? (
//     <select
//       value={latestVersion}
//       onChange={(event) => {
//         const version = event.target.value
//         localStorage.setItem('storybook-version', version)

//         // ✅ Preserve `?path=` query parameter
//         const searchParams = new URLSearchParams(window.location.search)
//         const storyPath = searchParams.has('path')
//           ? `?path=${searchParams.get('path')}`
//           : ''

//         // ✅ Redirect to the correct Storybook version
//         window.location.href = `/${version}/index.html${storyPath}`
//       }}
//       style={{
//         padding: '2px 5px',
//         borderRadius: '6px',
//         fontSize: '12px',
//         borderColor: 'rgba(38, 85, 115, 0.15)',
//         minWidth: '68px',
//         fontWeight: 600,
//         color: '#2E3438',
//         backgroundColor: '#fff',
//       }}
//     >
//       {versions.map((ver) => (
//         <option key={ver} value={ver}>
//           {ver === 'latest' ? 'Latest' : ver}
//         </option>
//       ))}
//     </select>
//   ) : (
//     <span style={{ color: 'red' }}>⚠️ No versions found</span>
//   )
// }

// // ✅ Register the addon
// addons.register('storybook/version-switcher', () => {
//   addons.add('storybook/version-switcher/tool', {
//     title: 'Version Switcher',
//     type: 'tool',
//     render: () => <VersionSwitcher />,
//   })
// })
