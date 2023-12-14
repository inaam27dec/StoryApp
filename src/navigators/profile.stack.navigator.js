import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../features/dashboard/profile/screens/profile.screen';
import GeneralSettingScreen from '../features/dashboard/profile/screens/general.settings.screen';
import GenresScreen from '../features/dashboard/profile/screens/genres.screen';
import VoiceChoiceScreen from '../features/dashboard/profile/screens/voice.choice.screen';
import AgeGroupScreen from '../features/dashboard/profile/screens/age.group.screen';
import EditProfileScreen from '../features/dashboard/profile/screens/edit.profile.screen';
import LeaderboardScreen from '../features/dashboard/story/screens/leaderboard.screen';
import WebViewScreen from '../features/authentication/Auth/screens/web.view.screen';
import navigationStrings from '../constants/navigationStrings';
import CertificateScreen from '../features/dashboard/story/screens/certificate.screen';

export const Stack = createStackNavigator();

export const ProfileStackNavigator = props => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      {/* <Stack.Screen name="SettingScreen" component={SettingScreen} /> */}
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="Certificate" component={CertificateScreen} />

      <Stack.Screen
        name="GeneraSettingScreen"
        component={GeneralSettingScreen}
      />
      <Stack.Screen
        name={navigationStrings.WEBVIEW_SCREEN}
        component={WebViewScreen}
      />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
      <Stack.Screen name="AgeGroupScreen" component={AgeGroupScreen} />
      <Stack.Screen name="GenresScreen" component={GenresScreen} />
      <Stack.Screen name="VoiceChoiceScreen" component={VoiceChoiceScreen} />
    </Stack.Navigator>
  );
};
