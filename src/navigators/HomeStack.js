import {createStackNavigator} from '@react-navigation/stack';
import React, {useLayoutEffect} from 'react';
import {HomeScreen} from '../features/dashboard/Home/screens/home.screen';
import SearchScreen from '../features/dashboard/screens/search.screen';
import AudioPlayer from '../features/dashboard/story/screens/AudioPlayer';
import {CharacterSelection} from '../features/dashboard/story/screens/CharacterSelection';
import CongraulationsScreen from '../features/dashboard/story/screens/CongraulationsScreen';
import LeaderboardScreen from '../features/dashboard/story/screens/leaderboard.screen';
import {QuestionScreen} from '../features/dashboard/story/screens/QuestionScreen';

import SubscriptionScreen from '../features/dashboard/story/screens/subscription.screen';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import QuestionnaireScreen from '../features/dashboard/story/screens/questionnaire.screen';
import BookStory from '../features/dashboard/story/screens/book_story';
import CertificateScreen from '../features/dashboard/story/screens/certificate.screen';

const Stack = createStackNavigator();

export const HomeStackNavigator = ({navigation, route}) => {
  useLayoutEffect(() => {
    console.log('Inside Layout Effect');
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'AudioPlayer' || routeName === 'BookStory') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
    } else {
      navigation.setOptions({tabBarStyle: {display: 'flex'}});
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="CharacterSelection" component={CharacterSelection} />
      <Stack.Screen
        name="QuestionnaireScreen"
        component={QuestionnaireScreen}
      />
      <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
      <Stack.Screen
        name="AudioPlayer"
        component={AudioPlayer}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="BookStory"
        component={BookStory}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="QuestionScreen"
        component={QuestionScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen
        name="CongraulationsScreen"
        component={CongraulationsScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
      <Stack.Screen name="Certificate" component={CertificateScreen} />
    </Stack.Navigator>
  );
};
