import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Images} from '../../constants/app.constants';
import {colors} from '../../infrastructure/theme/colors';

function InputComponent({
  heading,
  placeholder,
  isPasswordField = false,
  isSecureTextEntry,
  value,
  onChangeText,
  onShowPassword,
  editable,
}) {
  const [hideShowPassword, setHideShowPassword] = useState(isSecureTextEntry);
  return (
    <View>
      {isPasswordField ? (
        <View style={styles.viewFullName}>
          <Text style={styles.textFullName}>{heading}</Text>
          <View style={styles.sectionStyle}>
            <TextInput
              style={{flex: 1, color: editable ? colors.ui.black : 'gray'}}
              onChangeText={onChangeText}
              value={value}
              secureTextEntry={hideShowPassword}
              placeholder={placeholder}
              editable={editable}
              selectTextOnFocus={editable}
            />
            <TouchableOpacity
              onPress={() => {
                setHideShowPassword(!hideShowPassword);
              }}
              disabled={!editable}>
              <Image source={Images.eye} style={styles.imageStyle} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.viewFullName}>
          <Text style={styles.textFullName}>{heading}</Text>
          <TextInput
            style={{
              ...styles.textInput,
              ...{color: editable ? colors.ui.black : 'gray'},
            }}
            onChangeText={onChangeText}
            value={value}
            secureTextEntry={isSecureTextEntry}
            placeholder={placeholder}
            editable={editable}
            selectTextOnFocus={editable}
          />
        </View>
      )}
    </View>
  );
}

export default InputComponent;

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
  textInput: {
    height: 48,
    borderRadius: 38,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    padding: 10,
    marginTop: 7,
  },
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 38,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    // padding: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 7,
  },
  imageStyle: {
    padding: 10,
    margin: 0,
    height: 16,
    width: 22,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
});
