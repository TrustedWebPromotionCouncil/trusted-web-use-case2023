import type { Meta, StoryObj } from '@storybook/react'
import Home from '.'

const meta = {
  title: 'pages/Home',
  component: Home,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} satisfies Meta<typeof Home>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    user: {
      id: 1,
      email: '',
      name: 'ユーザーX',
      businessUnitId: 1,
      businessUnit: {
        id: 1,
        name:'',
        address: '',
        did: '',
        publicKey: '',
        privateKey: '',
        vcsForBusinessUnit: [],
        users: [],
        legalEntityId: 1,
        legalEntity: {
          id: 1,
          name: '事業者A',
          color: '#008080',
          businessUnits: [],
        },
        products: [],
        orders: [],
      }
    },
  },
}
