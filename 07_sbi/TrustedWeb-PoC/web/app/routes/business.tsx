import { type LoaderArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';
import Layout from '~/components/Layout';
import { userDataLoader } from '~/features/user/service.server';

export const loader = ({ request }: LoaderArgs) => userDataLoader(request, 'business');

const Business = () => {
  const { name, business_name } = useLoaderData<typeof loader>();

  return (
    <Layout
      userType="business"
      orgName={`Business Unit - ${business_name}`}
      userName={name}
      menu={[
        {
          heading: 'Business Unit IDs Management',
          links: [
            { text: 'Business Unit ID Requests', to: $path('/business/vcrequest') },
            { text: 'Business Unit IDs', to: $path('/business/vcrequests') },
          ],
        },
      ]}
    >
      <Outlet />
    </Layout>
  );
};

export default Business;
