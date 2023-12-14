import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {colors} from '../../infrastructure/theme/colors';
import {fonts} from '../../infrastructure/theme/fonts';
import {Spacer} from '../spacer/spacer.component';

import ToggleSelectionComponent from './toggle.selection.component';

const OptionModal = ({visible, value, onValueChange, onClose}) => {
  return (
    <>
      <Modal
        supportedOrientations={['portrait', 'landscape']}
        animationType="slide"
        transparent={true}
        visible={visible}
        supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.modal}>
          <View style={styles.optionContainer}>
            <TouchableWithoutFeedback>
              <ToggleSelectionComponent
                title="Highlight"
                value={value}
                onValueChange={onValueChange}
              />
            </TouchableWithoutFeedback>
            <View style={styles.striaghtLineBg} />
            <Spacer size={'large'} position={'bottom'} />
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                width: 130,
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.ui.purple,
                borderRadius: 20,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: fonts.Poppins_Medium,
                  fontSize: 15,
                  color: colors.ui.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBg} />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    width: 300,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1000,
    backgroundColor: colors.ui.white,
  },
  optionContainer: {
    padding: 20,
    paddingLeft: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 0,
  },
  options: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 10,
    letterSpacing: 1,
    backgroundColor: colors.ui.modalPurple,
    marginTop: 10,
    borderRadius: 7,
    height: 40,
    textAlign: 'center',
    color: colors.ui.white,
  },
  modalBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: colors.ui.black,
    opacity: 0.9,
  },
  striaghtLineBg: {
    borderBottomColor: colors.ui.lineColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    opacity: 10,
  },
  textStyle: {
    backgroundColor: colors.ui.white,
  },
});

export default OptionModal;
