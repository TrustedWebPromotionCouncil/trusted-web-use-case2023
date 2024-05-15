import './globals';
import { RootNavigator } from '@/navigations/RootNavigator';
import { RecoilRoot } from 'recoil';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Setting a timer',
  'AsyncStorage has been extracted from react-native core and will be removed in a future release',
]);

export default function App() {
  return (
    <RecoilRoot>
      <RootNavigator />
    </RecoilRoot>
  );
}
