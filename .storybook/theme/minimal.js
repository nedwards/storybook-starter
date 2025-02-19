import { create } from '@storybook/theming'
import Logo from './logo.svg'

export default create({
  base: 'light',

  // Branding
  brandTitle: 'My Storybook',
  brandUrl: '/',
  brandImage: Logo,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: '"Courier New", monospace',

  // Colors
  // colorPrimary: '#2C2C2C',
  // colorSecondary: '#666666',

  // UI Backgrounds
  appBg: '#FFFFFF',
  appContentBg: '#FFFFFF',
  appBorderColor: '#E0E0E0',
  appBorderRadius: 6,

  // Text Colors
  textColor: '#333333',
  textInverseColor: '#FFFFFF',

  // Toolbar (Header) Colors
  barBg: '#FFFFFF',
  barTextColor: '#666666',
  barSelectedColor: '#000000',

  // Sidebar (Navigation)
  sidebarBg: '#FFFFFF',
  sidebarTextColor: '#444444', // Dark grey text
  sidebarHighlightColor: '#000000', // Black highlight for active items
  sidebarBorderColor: '#E0E0E0', // Subtle border

  // Input Fields (Forms)
  inputBg: '#FFFFFF',
  inputBorder: '#CCCCCC',
  inputTextColor: '#333333',
  inputBorderRadius: 6,

  // Links
  linkColor: '#0066CC',
  linkHoverColor: '#004B99',

  // Code Blocks
  textMutedColor: '#888888',
  textHighlightColor: '#000000',
  codeColor: '#222222',
  codeBg: '#F4F4F4',

  // Borders
  borderColor: '#E0E0E0',
  borderRadius: 6,

  // Buttons
  buttonBg: '#F5F5F5',
  buttonBorder: '#D6D6D6',
  buttonTextColor: '#333333',
  buttonHoverBg: '#EAEAEA',
  buttonHoverBorder: '#CCCCCC',

  // Custom CSS Injection for Google Fonts
  fontUrl:
    'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap',
})
