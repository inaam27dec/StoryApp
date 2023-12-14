import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import styled from 'styled-components';
import PurpleButton from '../../../../components/utility/PurpleButton.component';
import {colors} from '../../../../infrastructure/theme/colors';
import {RowView} from '../../../../infrastructure/theme/global.styles';
import StarRating from 'react-native-star-rating-widget';

const DataContainer = styled(View)`
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  margin-left: 10px;
  margin-right: 10px;
`;

const Title = styled(Text)`
  font-family: ${props => props.theme.fonts.Poppins_Regular};
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.ui.black};
`;

function BookmarkCmponent({
  title,
  ratingVal,
  onPress,
  imgUrl,
  name,
  isSubscribed,
  isFree,
}) {
  const [rating, setRating] = useState(ratingVal);

  console.log('ratingVal ===', ratingVal);
  const isPaidStory = () => {
    let result = isSubscribed === false && isFree === false;
    console.log('isPaidStory result ===', result, isSubscribed, isFree);
    return result;
  };
  return (
    <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
      <RowView>
        <View style={styles.imgContainer}>
          <Image style={styles.img} resizeMode="cover" source={{uri: imgUrl}} />
        </View>
        <DataContainer>
          <Title numberOfLines={2} style={{marginTop: 12}}>
            {title}
          </Title>
          <View pointerEvents="none" style={{marginTop: 5, marginLeft: -5}}>
            <StarRating
              rating={rating}
              maxStars={5}
              starSize={22}
              onChange={setRating}
              color={'#FFB900'}
              enableHalfStar={false}
              minRating={0}
            />
          </View>
          <View style={{alignSelf: 'flex-end'}}>
            <PurpleButton
              title={isPaidStory() ? 'Purchase' : 'Start reading'}
              paddingHorizontal={24}
              paddingVertical={5}
              isPaid={isPaidStory()}
              onPressed={onPress}
            />
          </View>
        </DataContainer>
      </RowView>
    </TouchableOpacity>
  );
}

export default BookmarkCmponent;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    borderRadius: 25,
    height: 254,
    backgroundColor: 'white',
  },
  imgContainer: {
    height: 125,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: colors.ui.lightPurple,
  },
  img: {
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  btn: {
    fontSize: 10,
  },
});
