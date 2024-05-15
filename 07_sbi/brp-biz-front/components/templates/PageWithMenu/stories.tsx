import type { Meta, StoryObj } from '@storybook/react'
import PageWithMenu from '.'

const meta = {
  title: 'templates/PageWithMenu',
  component: PageWithMenu,
  parameters: {
    // layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
} satisfies Meta<typeof PageWithMenu>

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
    children: <div>children</div>
  },
}
