import React, {useEffect, useState} from 'react';

import {Modal, StyleSheet, Text, View} from 'react-native';
import styled from 'styled-components';
import {Spacer} from '../../../../components/spacer/spacer.component';
import PurpleButton from '../../../../components/utility/PurpleButton.component';
import {colors} from '../../../../infrastructure/theme/colors';
import {
  RowView,
  RowViews,
} from '../../../../infrastructure/theme/global.styles';
import StarRating from 'react-native-star-rating-widget';
import {updateStoryRatingByID} from '../../../../constants/social.helper';
import CustomActivityIndicator from '../../../../components/utility/activity.indicator.component';

const Title = styled(Text)`
  text-align: center;
  font-size: 16px;
  color: ${props => props.theme.colors.ui.black};
  font-family: ${props => props.theme.fonts.Poppins_Regular};
  font-weight: 600;
`;

const SubTitle = styled(Text)`
  text-align: center;
  font-size: 14px;
  color: ${props => props.theme.colors.ui.gray};
  font-family: ${props => props.theme.fonts.Poppins_Regular};
  font-weight: 500;
`;

function StoryRatingPopup({
  story,
  visible,
  children,
  onRateNowTapped,
  onNotNowTapped,
}) {
  const [showModal, setShowModal] = useState(visible);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  useEffect(() => {
    toggleModal();
  }, [visible]);
  return (
    <Modal
      supportedOrientations={['portrait', 'landscape']}
      transparent
      visible={showModal}>
      {loading && <CustomActivityIndicator animate={loading} />}
      <View style={styles.modalBackground}>
        <View style={styles.mainContainer}>
          <Title>How was the story?</Title>
          <Spacer position="bottom" size="large" />
          <SubTitle>Give us a quick review and help us improve?</SubTitle>
          <Spacer position="bottom" size="large" />

          <RowView>
            <StarRating
              rating={rating}
              maxStars={5}
              starSize={28}
              onChange={setRating}
              color={'#FFB900'}
            />
          </RowView>
          <Spacer position="bottom" size="veryLarge" />

          <RowViews>
            <PurpleButton
              style={{marginBottom: 10}}
              title="Rate"
              width={100}
              paddingVertical={6}
              onPressed={() => {
                let previousRating = story.data.rating;
                let previousTotalRatings = story.data.no_of_ratings;
                let newTotalRatings = previousTotalRatings + 1;
                let newRating =
                  (previousRating * previousTotalRatings + rating) /
                  newTotalRatings;
                setLoading(true);
                updateStoryRatingByID(
                  story.id,
                  newRating,
                  newTotalRatings,
                ).then(() => {
                  console.log('Rating Updated');
                  setLoading(false);
                  onRateNowTapped();
                });
              }}
            />
            <Spacer position="right" size="veryLarge" />
            <PurpleButton
              title="Not Now"
              width={100}
              paddingVertical={6}
              isSelected={false}
              onPressed={onNotNowTapped}
            />
          </RowViews>
        </View>
      </View>
    </Modal>
  );
}

export default StoryRatingPopup;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.ui.white,
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
  ratingImg: {
    width: 32,
    height: 32,
    padding: 5,
  },
});
