import React from 'react';
import navigationStrings from '../constants/navigationStrings';
import {SignupScreen} from '../features/authentication/Auth/screens/signup.screen';
import {SigInScreen} from '../features/authentication/Auth/screens/signin.screen';
import {ForgetPasswordScreen} from '../features/authentication/Auth/screens/forgetPassword.screen';
import {ResetPasswordScreen} from '../features/authentication/Auth/screens/resetPassword.screen';
import {createStackNavigator} from '@react-navigation/stack';
import WebViewScreen from '../features/authentication/Auth/screens/web.view.screen';

export const AuthStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={navigationStrings.LOGIN} component={SigInScreen} />
      <Stack.Screen name={navigationStrings.SIGNUP} component={SignupScreen} />
      <Stack.Screen
        name={navigationStrings.WEBVIEW_SCREEN}
        component={WebViewScreen}
      />
      <Stack.Screen
        name={navigationStrings.FORGET_PASSWORD}
        component={ForgetPasswordScreen}
      />
      <Stack.Screen
        name={navigationStrings.RESET_PASSWORD}
        component={ResetPasswordScreen}
      />
    </Stack.Navigator>
  );
};
