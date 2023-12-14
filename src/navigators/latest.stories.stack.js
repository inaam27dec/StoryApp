import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useLayoutEffect} from 'react';
import LatestStoriesScreen from '../features/dashboard/LatestStories/screens/latest.stories.screen';
import AudioPlayer from '../features/dashboard/story/screens/AudioPlayer';
import CongraulationsScreen from '../features/dashboard/story/screens/CongraulationsScreen';
import LeaderboardScreen from '../features/dashboard/story/screens/leaderboard.screen';
import QuestionnaireScreen from '../features/dashboard/story/screens/questionnaire.screen';
import {QuestionScreen} from '../features/dashboard/story/screens/QuestionScreen';
import SubscriptionScreen from '../features/dashboard/story/screens/subscription.screen';

const Stack = createStackNavigator();

function LatestStoriesStack({navigation, route}) {
  useLayoutEffect(() => {
    console.log('Inside Layout Effect');
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'AudioPlayer') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
    } else {
      navigation.setOptions({tabBarStyle: {display: 'flex'}});
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="LatestStoriesScreen"
        component={LatestStoriesScreen}
      />
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
        name="QuestionScreen"
        component={QuestionScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name="CongraulationsScreen"
        component={CongraulationsScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
    </Stack.Navigator>
  );
}

export default LatestStoriesStack;
