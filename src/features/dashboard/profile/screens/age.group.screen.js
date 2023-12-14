import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import styled from 'styled-components';
import {Spacer} from '../../../../components/spacer/spacer.component';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import ToggleSelectionComponent from '../../../../components/utility/toggle.selection.component';
import {ToolBar} from '../../../../components/utility/Toolbar';
import {Images} from '../../../../constants/app.constants';
import {MainContainer} from '../../../../infrastructure/theme/global.styles';

const Title = styled(Text)`
  font-size: 20px;
  font-family: ${props => props.theme.fonts.Poppins_Regular};
  font-weight: 600;
`;

function AgeGroupScreen(props) {
  const {navigation} = props;

  const [is0To2, setIs0To2] = useState(false);
  const [is3To5, setIs3To5] = useState(false);
  const [is6To9, setIs6To9] = useState(false);

  return (
    <SafeArea>
      <ToolBar
        showLeftIcon={true}
        leftIcon={Images.back}
        showRightIcon={false}
        rightIcon={Images.setting}
        heading="Age group"
        onLeftPressed={() => {
          navigation.pop();
        }}
        onRightPressed={() => {}}
      />
      <MainContainer>
        <Title>Select age group</Title>
        <Spacer position="bottom" size="medium" />
        <View style={styles.listContainer}>
          <ToggleSelectionComponent
            title="0-2 years"
            value={is0To2}
            onValueChange={setIs0To2}
          />
          <ToggleSelectionComponent
            title="3-5 years"
            value={is3To5}
            onValueChange={setIs3To5}
          />
          <ToggleSelectionComponent
            title="6-9 years"
            value={is6To9}
            onValueChange={setIs6To9}
          />
        </View>
      </MainContainer>
    </SafeArea>
  );
}

export default AgeGroupScreen;

const styles = StyleSheet.create({
  listContainer: {
    height: 150,
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    height: 50,
  },
});
