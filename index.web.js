import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('main', () => App);

if (typeof document !== 'undefined') {
  const root = document.getElementById('root');
  AppRegistry.runApplication('main', { rootTag: root });
}
