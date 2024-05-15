import { Actor, HttpAgent, ActorSubclass } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { signatureBackendCanisterId } from '@/canisters';

export const isLocal: boolean = process.env.NEXT_PUBLIC_DFX_NETWORK
  ? process.env.NEXT_PUBLIC_DFX_NETWORK !== 'ic'
  : process.env.NODE_ENV !== 'production';

export const getBackendHttpURL = (): string => {
  if (isLocal) {
    return `http://${signatureBackendCanisterId}.localhost:4943`;
  } else {
    return `https://${signatureBackendCanisterId}.raw.icp0.io`;
  }
};

export function createActor<T>(
  canisterId: string,
  interfaceFactory: IDL.InterfaceFactory
): ActorSubclass<T> {
  console.log('NEXT_PUBLIC_DFX_NETWORK', process.env.NEXT_PUBLIC_DFX_NETWORK);
  console.log('NODE_ENV', process.env.NODE_ENV);

  const hostOptions = {
    host: isLocal ? 'http://127.0.0.1:4943' : `https://${canisterId}.ic0.app`,
  };

  // const hostOptions = {
  //   host: `https://${canisterId}.ic0.app`,
  // };

  let agent = new HttpAgent(hostOptions);
  //const agent = new HttpAgent({});

  if (isLocal) {
    agent.fetchRootKey().catch((err) => {
      console.warn('Your local replica is not running');
      console.error(err);
    });
  }

  return Actor.createActor<T>(interfaceFactory, {
    agent,
    canisterId,
  });
}
