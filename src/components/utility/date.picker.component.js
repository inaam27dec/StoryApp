import RNDateTimePicker from '@react-native-community/datetimepicker';
import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet, View, Platform} from 'react-native';
import {colors} from '../../infrastructure/theme/colors';
import {TopHeading} from '../../infrastructure/theme/global.styles';
import {Spacer} from '../spacer/spacer.component';
import PurpleButton from './PurpleButton.component';

function DatePickerComponent({selectedDate, visible, onDateSelected, onClose}) {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(selectedDate);

  const dateChanged = (event, date) => {
    console.log('inside dateChanged');
    setDate(date);
  };
  const dateChangedAndroid = (event, date) => {
    if (event.type === 'set') {
      setDate(date);
      onDateSelected(date);
    } else {
      onClose();
    }
  };

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };
  // const onChange = (event, selectedDate) => {};
  useEffect(() => {
    if (Platform.OS == 'ios') {
      toggleModal();
    }
  }, [visible]);

  useEffect(() => {}, [showModal]);
  return (
    <View>
      {Platform.OS == 'ios' && (
        <Modal
          supportedOrientations={['portrait', 'landscape']}
          transparent
          visible={showModal}>
          <View style={styles.modalBackground}>
            <View style={styles.mainContainer}>
              <TopHeading style={{marginTop: 10}}>
                Please select Date
              </TopHeading>
              <Spacer position="bottom" size="veryLarge" />
              <View
                style={{
                  height: '63%',
                  backgroundColor: colors.ui.black,
                  width: '100%',
                }}>
                <RNDateTimePicker
                  style={{
                    backgroundColor: colors.ui.white,
                    height: '100%',
                    width: '100%',
                  }}
                  testID="dateTimePicker"
                  timeZoneOffsetInMinutes={0}
                  value={date}
                  mode="date"
                  is24Hour={true}
                  display={'inline'}
                  onChange={dateChanged}
                  positiveButtonLabel="OK!"
                  neutralButtonLabel="clear"
                />
              </View>
              <Spacer position="bottom" size="veryLarge" />
              <PurpleButton
                title="Done"
                width={100}
                paddingVertical={10}
                onPressed={() => {
                  onDateSelected(date);
                }}
              />
            </View>
          </View>
        </Modal>
      )}
      {Platform.OS === 'android' && visible && (
        <RNDateTimePicker
          style={{
            backgroundColor: colors.ui.white,
            height: '100%',
            width: '100%',
          }}
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={0}
          value={date}
          mode="date"
          is24Hour={true}
          display={'calendar'}
          onChange={dateChangedAndroid}
          positive="OK!"
          neutral="clear"
        />
      )}
    </View>
  );
}

export default DatePickerComponent;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    height: '50%',
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.ui.white,
    // margin: 20,
    padding: 10,
    borderRadius: 15,
  },
  picker: {
    backgroundColor: colors.ui.white,
    height: '100%',
    width: '100%',
  },
});
