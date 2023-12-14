import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native';
import {colors} from '../../infrastructure/theme/colors';

function DOBComponent({heading, placeholder, value, onPress}) {
  return (
    <View>
      <View style={styles.viewFullName}>
        <Text style={styles.textFullName}>{heading}</Text>
        <TouchableWithoutFeedback onPress={() => onPress()}>
          <View style={styles.textInputContainer}>
            {/* <TextInput
              editable={false}
              style={styles.textInput}
              value={value}
              placeholder={placeholder}
            /> */}
            <Text
              style={
                value === ''
                  ? {color: colors.ui.borderColor}
                  : {color: colors.ui.black}
              }>
              {value === '' || value === undefined || value === null
                ? placeholder
                : value}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

export default DOBComponent;

const styles = StyleSheet.create({
  viewFullName: {
    flexDirection: 'column',
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  textFullName: {
    fontSize: 12,
    fontWeight: '400',
    color: '#ABABAB',
  },
  textInputContainer: {
    height: 48,
    borderRadius: 38,
    borderColor: '#ABABAB',
    borderWidth: 1,
    padding: 0,
    marginTop: 7,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
  },
});
