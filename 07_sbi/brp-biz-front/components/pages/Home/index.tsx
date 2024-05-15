import PageWithMenu from '@/components/templates/PageWithMenu'
import { User } from '@/types'

interface Props {
  user: User;
}

const Home = ({ user }: Props) => {
  return (
    <PageWithMenu user={user} />
  )
}

export default Home