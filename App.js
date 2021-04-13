import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createAppContainer, createSwitchNavigator,} from 'react-navigation';
import SignupLoginScreen from './screens/SignupLoginScreen';
import { AppTabNavigator } from './components/AppTabNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContainer/>
    </SafeAreaProvider>
  );
}


const switchNavigator = createSwitchNavigator({
  SignupLoginScreen:{screen: SignupLoginScreen},
  HomeScreen:{screen: AppTabNavigator},
  
})

const AppContainer =  createAppContainer(switchNavigator);