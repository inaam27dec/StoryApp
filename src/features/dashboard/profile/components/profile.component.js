import React from 'react';
import {Image, Text, StyleSheet, View} from 'react-native';
import styled from 'styled-components';
import {Spacer} from '../../../../components/spacer/spacer.component';
import {Images} from '../../../../constants/app.constants';

const Title = styled(Text)`
  font-size: 16px;
  color: ${props => props.theme.colors.ui.black};
  font-family: ${props => props.theme.fonts.Poppins_Regular};
  font-weight: 500;
  left: 10px;
`;

const ImgContainer = styled(View)`
  margin-left: 0px;
  width: 34px;
  height: 34px;
  background-color: ${props => props.theme.colors.ui.lightPurple};
  border-radius: 17px;
  justify-content: center;
  align-items: center;
  align-self: center;
`;

function ProfileComponent({title, img, size}) {
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <ImgContainer>
          <Image
            source={img}
            style={{...styles.img, ...{width: size, height: size}}}
          />
        </ImgContainer>
        <Spacer position="right" size="large" />
        <Title>{title}</Title>
      </View>
      <Image source={Images.arrow_right} style={styles.arrorRightImg} />
    </View>
  );
}

export default ProfileComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 34,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrorRightImg: {
    width: 4.5,
    height: 9,
    resizeMode: 'contain',
    marginBottom: 4,
  },
});
