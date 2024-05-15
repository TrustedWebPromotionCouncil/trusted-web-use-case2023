import type { Meta, StoryObj } from '@storybook/react'
import Inventories from '.'

const meta = {
  title: 'pages/Inventories',
  component: Inventories,
  parameters: {
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof Inventories>

export default meta
type Story = StoryObj<typeof meta>

const businessUnit = {
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
const user = {
  id: 1,
  email: '',
  name: 'ユーザーX',
  businessUnitId: 1,
  businessUnit,
}

export const Primary: Story = {
  args: {
    user,
    orders: [],
  },
}

export const Processing: Story = {
  args: {
    user,
    orders: [],
    processing: true
  },
}
