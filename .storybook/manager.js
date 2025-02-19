import { addons } from '@storybook/manager-api'
import minimal from './theme/minimal'
import './addons/VersionDropdown'

addons.setConfig({
  theme: minimal,
})
