import { addons } from '@storybook/manager-api'
import React, { useState, useEffect, useCallback } from 'react'

const isDevMode =
  window.location.hostname === 'localhost' && window.location.port === '6006'
const versionsJsonUrl = `/versions.json?t=${new Date().getTime()}`

const VersionSwitcher = () => {
  const [versions, setVersions] = useState([])
  const [latestVersion, setLatestVersion] = useState('loading...')
  const [selectedVersion, setSelectedVersion] = useState('')

  useEffect(() => {
    fetch(versionsJsonUrl)
      .then((res) => res.json())
      .then((data) => {
        const allVersions = ['latest', ...data.versions]
        setVersions(allVersions)
        setLatestVersion(data.latest || 'unknown')

        const urlSegments = window.location.pathname.split('/')
        const currentVersion = urlSegments[1]
        const storedVersion = localStorage.getItem('storybook-version')

        setSelectedVersion(
          currentVersion && allVersions.includes(currentVersion)
            ? currentVersion
            : storedVersion || 'latest'
        )
      })
      .catch((err) => {
        console.error('🚨 Error loading versions.json:', err)
        setLatestVersion('error')
      })
  }, [])

  const handleVersionChange = useCallback((event) => {
    const version = event.target.value
    setSelectedVersion(version)
    localStorage.setItem('storybook-version', version)

    const searchParams = new URLSearchParams(window.location.search)
    const storyPath = searchParams.has('path')
      ? `?path=${searchParams.get('path')}`
      : ''

    const redirectUrl =
      version === 'latest'
        ? `/latest/${storyPath}`
        : `/${version}/index.html${storyPath}`

    console.log(`🔄 Redirecting to: ${redirectUrl}`)
    window.location.href = redirectUrl
  }, [])

  const styles = {
    select: {
      padding: '0',
      borderRadius: '0',
      fontSize: '13px',
      borderColor: 'rgb(115, 130, 140)',
      minWidth: '80px',
      backgroundColor: '#fff',
    },
    error: {
      color: 'red',
    },
    devMode: {
      fontSize: '13px',
      fontWeight: 600,
    },
  }

  if (isDevMode) {
    return <span style={styles.devMode}>{latestVersion}</span>
  }

  return versions.length > 0 ? (
    <select
      value={selectedVersion}
      onChange={handleVersionChange}
      style={styles.select}
    >
      {versions.map((ver) => (
        <option key={ver} value={ver}>
          {ver === 'latest' ? 'Latest' : ver}
        </option>
      ))}
    </select>
  ) : (
    <span style={styles.error}>⚠️ No versions found</span>
  )
}

addons.register('storybook/version-switcher', () => {
  addons.add('storybook/version-switcher/tool', {
    title: 'Version Switcher',
    type: 'tool',
    render: () => <VersionSwitcher />,
  })
})
