import { type LoaderArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';
import Layout from '~/components/Layout';
import { userDataLoader } from '~/features/user/service.server';

export const loader = ({ request }: LoaderArgs) => userDataLoader(request, 'authority');

const Authority = () => {
  const { name, display_org_name } = useLoaderData<typeof loader>();

  return (
    <Layout
      userType="authority"
      orgName={display_org_name}
      userName={name}
      menu={[
        {
          heading: 'Business Units Management',
          links: [
            { text: 'Ongoing', to: $path('/authority/vcissueds') },
          ],
        },
        {
          heading: 'Digital Certificate Management',
          links: [{ text: 'Digital Certificates', to: $path('/authority/vcreceiveds') }],
        },
      ]}
    >
      <Outlet />
    </Layout>
  );
};

export default Authority;
