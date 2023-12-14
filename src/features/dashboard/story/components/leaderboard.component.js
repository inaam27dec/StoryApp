import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Spacer} from '../../../../components/spacer/spacer.component';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';
import {RowViews} from '../../../../infrastructure/theme/global.styles';

function LeaderboardComponent({item, i, onPress}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
      <View syle={{flex: 1}}>
        <RowViews style={styles.mainContainer}>
          <Text style={styles.txt}>{i + 1}</Text>
          <Spacer position="right" size="large" />
          <View style={styles.lblContainer}>
            <Text style={styles.storyTitle} numberOfLines={2}>
              {item.data.story_title}
            </Text>
            <View
              style={{
                width: '20%',
                backgroundColor:
                  item.data.story_points >= 80 ? '#FFF3B4' : '#D3FFBA',
                borderRadius: 25,
              }}>
              <Text style={styles.storyPoints}>
                {item.data.story_points} pts
              </Text>
            </View>
          </View>
        </RowViews>
      </View>
    </TouchableOpacity>
  );
}

export default LeaderboardComponent;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
  },
  mainContainer: {
    paddingHorizontal: 30,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: colors.ui.gray,
    shadowOffset: {width: 2, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    height: 72,
    backgroundColor: colors.ui.white,
  },
  txt: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  lblContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  storyTitle: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: 15,
    color: colors.ui.black,
    width: '80%',
    fontWeight: '400',
  },
  storyPoints: {
    fontFamily: fonts.Poppins_Regular,
    fontSize: 11,
    color: colors.ui.black,
    textAlign: 'center',
    padding: 6,
  },
});
