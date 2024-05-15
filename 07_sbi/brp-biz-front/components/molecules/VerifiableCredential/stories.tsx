import type { Meta, StoryObj } from '@storybook/react'
import VerifiableCredential from '.'

const meta = {
  title: 'templates/VerifiableCredential',
  component: VerifiableCredential,
  parameters: {
    // layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof VerifiableCredential>

export default meta
type Story = StoryObj<typeof meta>

const businessUnit = {
  id: 1,
  name: '',
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

export const Primary: Story = {
  args: {
    vcForBusinessUnit: {
      id: 1,
      authenticationLevel: 1,
      issuerName: "P Digital Certificate Organization 1",
      uuid: "2344e400-e29b-6666-a716-443422234121",
      validFrom: new Date(),
      validUntil: new Date(),
      businessUnitId: 1,
      businessUnit,
      original: undefined
    }
  },
}
