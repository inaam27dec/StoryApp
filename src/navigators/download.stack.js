import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DownloadScreen from '../features/dashboard/download/screens/download.screen';

const Stack = createStackNavigator();

export const DownloadStackNavigator = props => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="DownloadScreen" component={DownloadScreen} />
    </Stack.Navigator>
  );
};
