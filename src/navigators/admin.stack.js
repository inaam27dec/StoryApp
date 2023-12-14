import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import StoriesScreen from '../features/admin/screens/stories.screen';
import AudioPlayer from '../features/dashboard/story/screens/AudioPlayer';
import {QuestionScreen} from '../features/dashboard/story/screens/QuestionScreen';

const Stack = createStackNavigator();

function AdminStack(props) {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="StoriesScreen" component={StoriesScreen} />
      <Stack.Screen name="AudioPlayer" component={AudioPlayer} />
      <Stack.Screen name="QuestionScreen" component={QuestionScreen} />
    </Stack.Navigator>
  );
}

export default AdminStack;
