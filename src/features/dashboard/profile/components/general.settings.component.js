import React from 'react';
import {Image, Text, StyleSheet, View} from 'react-native';
import styled from 'styled-components';
import {Images} from '../../../../constants/app.constants';
import {RowView} from '../../../../infrastructure/theme/global.styles';

const Title = styled(Text)`
  text-align: left;
  font-size: 16px;
  color: ${props => props.theme.colors.ui.black};
  font-family: ${props => props.theme.fonts.Poppins_Regular};
  font-weight: 500;
`;

function GeneralSettingsComponent({title}) {
  return (
    <View style={styles.container}>
      <RowView style={styles.rowContainer}>
        <Title>{title}</Title>
      </RowView>
      <Image
        source={Images.arrow_right}
        style={{
          width: 4.5,
          height: 9,
          resizeMode: 'contain',
        }}
      />
    </View>
  );
}

export default GeneralSettingsComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowContainer: {
    alignItems: 'center',
  },
});
