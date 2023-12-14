import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SplashScreen} from '../features/splash/splash.screen';
import {AuthStack} from './AuthStack';
import DashboardNavStack from './DashboardStack';
import SwiperComponent from '../features/authentication/OnBoarding/screens/swiper';
import AdminStack from './admin.stack';
const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Swiper" component={SwiperComponent} />
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="AdminStack" component={AdminStack} />
        <Stack.Screen name="DashboardTabs" component={DashboardNavStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
