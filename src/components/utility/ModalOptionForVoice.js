import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  Platform,
} from 'react-native';
import {colors} from '../../infrastructure/theme/colors';

import ToggleSelectionComponent from './toggle.selection.component';
import styled from 'styled-components';
import CustomActivityIndicator from './activity.indicator.component';
import {TouchableOpacity} from 'react-native';
import {fonts} from '../../infrastructure/theme/fonts';
import {Spacer} from '../spacer/spacer.component';

let selectedIndex = 0;

const OptionModalForVoice = ({
  visible,
  narratorList,
  selectedNarrator,
  onValueChange,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (narratorList !== undefined && selectedNarrator !== undefined) {
      let index = narratorList.findIndex(obj => obj.id === selectedNarrator.id);
      selectedIndex = index;
    }
  }, []);

  const valueChanged = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };
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
            <Title>Select Voice</Title>
            <View style={styles.toggleSelection}>
              {loading && <CustomActivityIndicator animate={loading} />}
              <FlatList
                data={narratorList}
                renderItem={({index, item}) => {
                  return (
                    <ToggleSelectionComponent
                      title={item.name}
                      value={index === selectedIndex}
                      onValueChange={value => {
                        console.log('previous index', selectedIndex);
                        if (value) {
                          selectedIndex = index;
                        }
                        console.log('new index', selectedIndex);
                        valueChanged();
                      }}
                    />
                  );
                }}
              />
            </View>
            <View style={styles.straightLineBg} />
            <Spacer size={'large'} position={'bottom'} />
            <TouchableOpacity
              onPress={() => {
                console.log('pressed');
                let updatedNarrator = narratorList[selectedIndex];
                if (selectedNarrator.id !== updatedNarrator.id) {
                  onClose(true, updatedNarrator);
                } else {
                  onClose(false, selectedNarrator);
                }
              }}
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
        <TouchableWithoutFeedback
          onPress={() => {
            console.log('pressed 2');
            onClose(false, selectedNarrator);
          }}>
          <View style={styles.modalBg} />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    // position: 'absolute',
    // bottom: 0,
    // right: 0,
    // left: 0,
    // borderTopRightRadius: 20,
    // borderTopLeftRadius: 20,
    // zIndex: 1000,
    // backgroundColor: colors.ui.white,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    width: 300,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1000,
    backgroundColor: colors.ui.white,
  },
  toggleSelection: {
    marginTop: 10,
  },
  optionContainer: {
    padding: 20,
    paddingLeft: Platform.OS === 'ios' ? 50 : 20,
  },
  title: {
    color: colors.ui.black,
    fontSize: 20,
    fontFamily: 'Poppins',
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
  straightLineBg: {
    borderBottomColor: colors.ui.lineColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
  },
  textStyle: {
    backgroundColor: colors.ui.white,
  },
});

const Title = styled(Text)`
  font-size: 20px;
  font-family: ${props => props.theme.fonts.Poppins_Regular};
  font-weight: 600;
`;

export default OptionModalForVoice;
