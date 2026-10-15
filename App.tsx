import { StatusBar } from 'expo-status-bar';
import LogScreen from './src/screens/LogScreen';

export default function App() {
  return (
    <>
      <LogScreen />
      <StatusBar style="auto" />
    </>
  );
}