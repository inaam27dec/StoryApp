import React from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Spacer} from '../../../../components/spacer/spacer.component';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import {ToolBar} from '../../../../components/utility/Toolbar';
import {Images} from '../../../../constants/app.constants';
import {MainContainer} from '../../../../infrastructure/theme/global.styles';
import ProfileComponent from '../components/profile.component';

function SettingScreen(props) {
  const {navigation} = props;

  const list = [
    {
      icon: Images.setting_purple,
      text: 'General Settings',
    },
    {
      icon: Images.bell_purple,
      text: 'Notification',
    },
    {
      icon: Images.lock_purple,
      text: 'Privacy',
    },
    {
      icon: Images.security_purple,
      text: 'Security',
    },
    {
      icon: Images.help_purple,
      text: 'Help',
    },
    {
      icon: Images.about_purple,
      text: 'About',
    },
  ];

  const itemTapped = index => {
    switch (index) {
      case 0:
        break;
      case 1:
        break;
      default:
        break;
    }
  };
  return (
    <SafeArea>
      <ToolBar
        showLeftIcon={true}
        leftIcon={Images.back}
        showRightIcon={false}
        rightIcon={Images.setting}
        heading="Settings"
        onLeftPressed={() => {
          navigation.pop();
        }}
        onRightPressed={() => {}}
      />
      <MainContainer>
        <FlatList
          style={styles.list}
          data={list}
          keyExtractor={(item, index) => `${index}`}
          ItemSeparatorComponent={props => {
            return <View style={{height: 20}} />;
          }}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => {
                itemTapped(index);
              }}>
              <ProfileComponent title={item.text} img={item.icon} />
              <Spacer position="bottom" size="medium" />
            </TouchableOpacity>
          )}
        />
      </MainContainer>
    </SafeArea>
  );
}

export default SettingScreen;

const styles = StyleSheet.create({
  list: {
    flexDirection: 'column',
  },
});
