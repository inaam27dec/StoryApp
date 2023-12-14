import React, {useEffect, useState} from 'react';

import {Image, Modal, StyleSheet, View} from 'react-native';
import {colors} from '../../../../infrastructure/theme/colors';
import imagePath from '../../../../constants/imagePath';

function AnswerStatusPopup({visible, isCorrect, onHide}) {
  const [showModal, setShowModal] = useState(visible);

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  useEffect(() => {
    toggleModal();
    setTimeout(() => {
      onHide();
    }, 1000);
  }, [visible]);

  return (
    <Modal
      supportedOrientations={['portrait', 'landscape']}
      transparent
      visible={showModal}>
      <View style={styles.modalBackground}>
        <View style={styles.mainContainer}>
          <Image
            style={styles.img}
            source={isCorrect ? imagePath.tick : imagePath.cross}
            resizeMode="contain"
          />
        </View>
      </View>
    </Modal>
  );
}

export default AnswerStatusPopup;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.ui.clear,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    padding: 30,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    // flex: 1,
    width: 100,
    height: 100,
    // backgroundColor: colors.ui.purple,
  },
});
