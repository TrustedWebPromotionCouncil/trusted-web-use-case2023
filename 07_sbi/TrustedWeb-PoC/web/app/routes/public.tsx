import { type LoaderArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';
import Layout from '~/components/Layout';
import { userDataLoader } from '~/features/user/service.server';

export const loader = ({ request }: LoaderArgs) => userDataLoader(request, 'public');

const Public = () => {
  const { name, display_org_name } = useLoaderData<typeof loader>();

  return (
    <Layout
      userType="public"
      orgName={display_org_name}
      userName={name}
      menu={[{
        links: [
          { text: 'DCO Digital Certificates', to: $path('/public/authority/vcissueds') },
          { text: 'RCO Digital Certificates', to: $path('/public/revoke/vcissueds') },
        ],
      }]}
    >
      <Outlet />
    </Layout>
  );
};

export default Public;
