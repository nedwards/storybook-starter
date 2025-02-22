import { fn } from '@storybook/test'

import { Button } from '../Button'

import Docs from './docs.mdx'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: 'centered',
    docs: {
      page: Docs,
    },
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
}

export const Default = {
  name: 'Default Button',
  args: {
    label: 'Button',
  },
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  name: 'Primary Button',
  args: {
    variant: 'primary',
    label: 'Button',
  },
}

export const Secondary = {
  name: 'Secondary Button',
  args: {
    variant: 'secondary',
    label: 'Button',
  },
}

export const Large = {
  name: 'Large Button',
  args: {
    size: 'large',
    label: 'Button',
  },
}

export const Small = {
  name: 'Small Button',
  args: {
    size: 'small',
    label: 'Button',
  },
}
