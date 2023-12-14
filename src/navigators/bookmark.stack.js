import React, {useLayoutEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {QuestionScreen} from '../features/dashboard/story/screens/QuestionScreen';
import CongraulationsScreen from '../features/dashboard/story/screens/CongraulationsScreen';
import BookmarkScreen from '../features/dashboard/bookmarks/screens/bookmark.screen';
import LeaderboardScreen from '../features/dashboard/story/screens/leaderboard.screen';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import AudioPlayer from '../features/dashboard/story/screens/AudioPlayer';

const Stack = createStackNavigator();

export const BookmarkStack = ({navigation, route}) => {
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
      <Stack.Screen name="BookmarkScreen" component={BookmarkScreen} />
      <Stack.Screen
        name="AudioPlayer"
        component={AudioPlayer}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen name="QuestionScreen" component={QuestionScreen} />
      <Stack.Screen
        name="CongraulationsScreen"
        component={CongraulationsScreen}
      />
      <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
    </Stack.Navigator>
  );
};

export default BookmarkStack;
