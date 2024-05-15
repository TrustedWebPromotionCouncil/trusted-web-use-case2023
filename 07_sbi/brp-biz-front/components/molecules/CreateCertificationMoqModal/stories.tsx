import type { Meta, StoryObj } from '@storybook/react'
import  CreateCertificationModal from '.'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'molecules/CreateCertificationModal',
  component: CreateCertificationModal,
  parameters: {
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof CreateCertificationModal>

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
    open: true,
    level: '1',
    user,
    onClose: () => {},
  },
}

