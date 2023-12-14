import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Spacer} from '../../../../components/spacer/spacer.component';
import PurpleButton from '../../../../components/utility/PurpleButton.component';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';

function QuestionnaireComponent({question, list, getUserAnswer}) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.question}>{question}</Text>
      <FlatList
        data={list}
        renderItem={({item, index}) => (
          <View>
            <PurpleButton
              title={item}
              paddingVertical={5}
              paddingHorizontal={40}
              isSelected={index === selectedIndex}
              onPressed={() => {
                setSelectedIndex(index);
                getUserAnswer(index);
              }}
            />
            <Spacer position={'bottom'} size="large" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    height: 240,
    borderRadius: 20,
    borderColor: colors.ui.purple,
    borderWidth: 0.3,
  },
  question: {
    color: colors.ui.black,
    fontFamily: fonts.Poppins_Medium,
    fontSize: 16,
    marginBottom: 20,
  },
});

export default QuestionnaireComponent;
