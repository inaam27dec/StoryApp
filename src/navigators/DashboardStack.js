import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors} from '../infrastructure/theme/colors';
import {Images} from '../constants/app.constants';
import {Image} from 'react-native';
import {ProfileStackNavigator} from './profile.stack.navigator';
import {HomeStackNavigator} from './HomeStack';
import BookmarkStack from './bookmark.stack';

import LatestStoriesStack from './latest.stories.stack';

import {DownloadStackNavigator} from './download.stack';
import imagePath from '../constants/imagePath';

const Tab = createBottomTabNavigator();

export default function DashboardNavStack() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarLabelStyle: '30px',
        tabBarActiveTintColor: colors.ui.purple,
        tabBarInactiveTintColor: colors.ui.gray,
        headerShown: false,
        tabBarStyle: {
          borderTopLeftRadius: 34,
          borderTopRightRadius: 34,
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        size={20}
        options={{
          style: {justifyContent: 'center', alignItems: 'Center'},
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Image
                style={{height: 20, width: 20, resizeMode: 'contain'}}
                source={focused ? Images.home_selected : Images.home_unselected}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Bookmark"
        component={BookmarkStack}
        options={{
          style: {justifyContent: 'center', alignItems: 'Center'},
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Image
                style={{
                  height: 17,
                  width: 20,
                  resizeMode: 'contain',
                }}
                // style={{
                //   tintColor: focused ? colors.ui.purple : colors.ui.gray,
                // }}
                source={
                  focused
                    ? Images.bookmark_selected
                    : Images.bookmark_unselected
                }
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="Download"
        component={DownloadStackNavigator}
        size={20}
        options={{
          style: {justifyContent: 'center', alignItems: 'Center'},
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Image
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                  tintColor: focused ? '#8814ec' : '#282444',
                }}
                source={
                  focused ? imagePath.download : Images.download_unselected
                }
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="LatestStoriesStack"
        component={LatestStoriesStack}
        options={{
          style: {
            justifyContent: 'center',
            alignItems: 'Center',
          },
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Image
                style={{
                  height: 25,
                  width: 25,
                  resizeMode: 'contain',
                  tintColor: focused ? '#8814ec' : '#282444',
                }}
                source={
                  focused
                    ? Images.latest_stories_selected
                    : Images.latest_stories_unselected
                }
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          style: {justifyContent: 'center', alignItems: 'Center'},
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Image
                style={{height: 20, width: 20, resizeMode: 'contain'}}
                source={focused ? Images.user_selected : Images.user_unselected}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
