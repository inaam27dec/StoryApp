import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import styled from 'styled-components';
import {colors} from '../../infrastructure/theme/colors';
import {RowView, RowViews} from '../../infrastructure/theme/global.styles';

const Title = styled(Text)`
  text-align: left;
  font-size: 16px;
  color: ${props => props.theme.colors.ui.black};
  font-family: ${props => props.theme.fonts.Poppins_Regular};
  font-weight: 500;
`;

function ToggleSelectionComponent({title, value, onValueChange, onChange}) {
  return (
    <View style={styles.container}>
      <RowViews style={styles.rowContainer}>
        <Title>{title}</Title>
      </RowViews>
      <Switch
        style={{transform: [{scaleX: 1.0}, {scaleY: 1.0}]}}
        trackColor={{false: colors.ui.lightGray, true: colors.ui.purple}}
        thumbColor={value ? colors.ui.white : colors.ui.white}
        ios_backgroundColor={colors.ui.lightGray}
        onValueChange={onValueChange}
        value={value}
        onChange={onChange}
      />
    </View>
  );
}

export default ToggleSelectionComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingBottom: 20,
    //height: 60,
  },
  rowContainer: {
    alignItems: 'center',
    width: '60%',
  },
});
