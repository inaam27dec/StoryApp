import React from 'react';
import {StyleSheet, View, Modal, ActivityIndicator} from 'react-native';
import {colors} from '../../infrastructure/theme/colors';
function CustomActivityIndicator(props) {
  const {animate, style} = props;
  return (
    <Modal
      supportedOrientations={['portrait', 'landscape']}
      transparent={true}
      animationType={'none'}
      visible={animate}
      onRequestClose={() => {}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={true}
            color={colors.ui.purple}
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      </View>
    </Modal>
  );
}

export default CustomActivityIndicator;

// const styles = StyleSheet.create({
//   indicatorStyle: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#EFEAF5',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
