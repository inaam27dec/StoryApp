import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ToolBar} from '../../../../components/utility/Toolbar';
import {Images} from '../../../../constants/app.constants';
import {colors} from '../../../../infrastructure/theme/colors';
import {FlipPage, FlipPagePage} from '../../../../components/book_page';
import imagePath from '../../../../constants/imagePath';
import Orientation from 'react-native-orientation-locker';
import {fonts} from '../../../../infrastructure/theme/fonts';

function BookStory(props) {
  const {navigation} = props;
  const paragraphs = useState([
    {
      type: 'image',
      data: imagePath.characters,
    },
    {
      type: 'text',
      data: imagePath.characters,
    },
  ]);

  useEffect(() => {
    Orientation.lockToLandscape();
  }, []);
  return (
    <View style={{flex: 1}}>
      <View>
        <ToolBar
          isStoryScreen={true}
          showLeftIcon={true}
          leftIcon={Images.back}
          showRightIcon={false}
          rightIcon={Images.setting}
          heading=""
          onLeftPressed={() => {
            navigation.pop();
            setTimeout(() => {
              Orientation.lockToPortrait();
            }, 300);
          }}
          onRightPressed={() => {}}
        />
      </View>
      <View style={styles.mainContainer}>
        <FlipPage
          style={{backgroundColor: colors.ui.white}}
          orientation={'horizontal'}>
          {paragraphs.map((para, index) => (
            <FlipPagePage key={index} style={styles.firstPage}>
              <View
                style={{
                  ...styles.pageContainer,
                }}>
                <Text style={styles.textStyle}>This is page {index}</Text>
              </View>
              <View
                style={{
                  height: '100%',
                  backgroundColor: 'black',
                  borderColor: 'gray', // if you need
                  borderWidth: 2,
                  overflow: 'hidden',
                  shadowColor: 'blue',
                  shadowRadius: 10,
                  shadowOpacity: 0.9,
                  flex: 1,
                }}></View>
              <View
                style={{
                  width: '49.8%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.textStyle}>This is some text 2</Text>
              </View>
            </FlipPagePage>
          ))}
        </FlipPage>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.ui.darkGray,
  },
  firstPage: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.ui.lightPurple,
  },
  pageContainer: {
    width: '49.8%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgStyle: {
    flex: 0.5,
    height: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  textStyle: {
    flex: 0.5,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    color: colors.ui.black,
    fontSize: 15,
    fontFamily: fonts.Poppins_Regular,
  },
});

export default BookStory;
