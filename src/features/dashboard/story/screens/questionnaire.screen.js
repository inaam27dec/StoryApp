import React, {useEffect, useState} from 'react';
import {Alert, Modal, StyleSheet, Text, View} from 'react-native';
import {Spacer} from '../../../../components/spacer/spacer.component';
import PurpleBorderedButton from '../../../../components/utility/purple.bordered.button';
import PurpleButton from '../../../../components/utility/PurpleButton.component';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';
import QuestionnaireComponent from '../components/questionnaire.component';

function QuestionnaireScreen({visible, onSuccess, onCancelTapped}) {
  const [showModal, setShowModal] = useState(visible);

  const list = [
    {
      question: 'How many inches in a yard?',
      answers: ['36', '40', '44'],
      correctIndex: 0,
    },
    {
      question: 'What is the largest planet in our solar system?',
      answers: ['Mercury', 'Jupiter', 'Earth'],
      correctIndex: 1,
    },
    {
      question: 'How many inches in a foot?',
      answers: ['10', '12', '14'],
      correctIndex: 1,
    },
    {
      question: 'What is the fastest land animal?',
      answers: ['Zebra', 'Giraffe', 'Cheetah'],
      correctIndex: 2,
    },
    {
      question: 'What is the sweet food made by bees?',
      answers: ['Bread', 'Honey', 'Butter'],
      correctIndex: 1,
    },
    {
      question: ' What is the largest ocean on Earth?',
      answers: ['The Pacific', 'The Atlantic', 'The Arctic'],
      correctIndex: 0,
    },
    {
      question: 'What is the longest river in the world?',
      answers: ['Mekong River', 'Nile', 'Yellow River'],
      correctIndex: 1,
    },
    {
      question: 'What does a thermometer measure?',
      answers: ['Blood pressure', 'Sugar', 'Temperature'],
      correctIndex: 2,
    },
    {
      question: 'What color are the stars in the American flag?',
      answers: ['White', 'Black', 'Blue'],
      correctIndex: 0,
    },
    {
      question: 'Which shape has 4 sides?',
      answers: ['Circle', 'Square', 'Triangle'],
      correctIndex: 1,
    },
  ];

  const [randomNumber, setRandomNumber] = useState(0);
  const generateRandomNumber = () => {
    const randomNumber = Math.floor(Math.random() * list.length);
    setRandomNumber(randomNumber);
  };
  const [givenAnswerIndex, setGivenAnserIndex] = useState(-1);
  const getUserAnser = index => {
    setGivenAnserIndex(index);
  };

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  useEffect(() => {
    console.log('questionnaire screen useEffect');

    toggleModal();
    generateRandomNumber();
  }, [visible]);

  return (
    <View>
      <Modal
        supportedOrientations={['portrait', 'landscape']}
        transparent
        visible={showModal}>
        <View style={styles.modalBackground}>
          <View style={styles.mainContainer}>
            <Text style={styles.title}>Ask your parents</Text>
            <QuestionnaireComponent
              question={list[randomNumber].question}
              list={list[randomNumber].answers}
              getUserAnswer={getUserAnser}
            />
            <Spacer position={'bottom'} size={'small'} />
            <Spacer position={'bottom'} size={'large'} />
            <PurpleButton
              title={'Submit'}
              paddingVertical={5}
              paddingHorizontal={40}
              isSelected={true}
              onPressed={() => {
                if (givenAnswerIndex === -1) {
                  Alert.alert('Alert', 'Please select an answer');
                } else {
                  if (givenAnswerIndex !== list[randomNumber].correctIndex) {
                    Alert.alert('Error', 'Wrong answer', [
                      {
                        text: 'OK',
                        onPress: () => onCancelTapped(),
                      },
                    ]);
                  } else {
                    onSuccess();
                  }
                }
              }}
            />
            <Spacer position={'bottom'} size={'large'} />
            <PurpleBorderedButton
              title={'Cancel'}
              paddingVertical={5}
              paddingHorizontal={40}
              isSelected={true}
              onPressed={onCancelTapped}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default QuestionnaireScreen;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    height: 440,
    width: '85%',
    alignItems: 'center',
    backgroundColor: colors.ui.white,
    borderRadius: 15,
    paddingBottom: 20,
  },
  title: {
    margin: 20,
    color: colors.ui.purple,
    fontFamily: fonts.Poppins_Bold,
    fontSize: 25,
  },
});
