import { type LoaderArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';
import Layout from '~/components/Layout';
import { userDataLoader } from '~/features/user/service.server';

export const loader = ({ request }: LoaderArgs) => userDataLoader(request, 'revoke');

const Revoke = () => {
  const { name, display_org_name } = useLoaderData<typeof loader>();

  return (
    <Layout
      userType="revoke"
      orgName={display_org_name}
      userName={name}
      menu={[
        {
          links: [{ text: 'Revoked Digital Certificates', to: $path('/revoke/idrevokeds') }],
        },
        {
          heading: 'Digital Certificate Management',
          links: [{ text: 'Digital Certificates', to: '/revoke/vcissueds' }],
        },
      ]}
    >
      <Outlet />
    </Layout>
  );
};

export default Revoke;
