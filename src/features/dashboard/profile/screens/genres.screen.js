import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import styled from 'styled-components';
import {Spacer} from '../../../../components/spacer/spacer.component';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import ToggleSelectionComponent from '../../../../components/utility/toggle.selection.component';
import {ToolBar} from '../../../../components/utility/Toolbar';
import {Images} from '../../../../constants/app.constants';
import {getGenres} from '../../../../constants/social.helper';

const FlatListContainer = styled(View)`
  flex: 1;
`;
const CategoryList = styled(FlatList)`
  flex-direction: column;
  margin-left: 15px;
  margin-right: 15px;
`;

function GenresScreen(props) {
  const {navigation} = props;

  const [genres, setGenres] = useState([]);
  const [toggleArray, setToggleArray] = useState([]);

  const updateArray = (value, index) => {
    let val = toggleArray;
    val[index] = value;
    setToggleArray(val);
  };

  let size = genres.length;
  let toggle = Array(size).fill(false);
  console.log(toggle);

  useEffect(() => {
    getGenres().then(data => {
      console.log(data);
      setGenres(data);
    });
    setToggleArray(toggle);
  }, []);

  console.log(toggleArray);

  return (
    <SafeArea>
      <ToolBar
        showLeftIcon={true}
        leftIcon={Images.back}
        showRightIcon={true}
        rightIcon={Images.setting}
        isText={true}
        heading="Genres"
        onLeftPressed={() => {
          navigation.pop();
        }}
        onRightPressed={() => {}}
      />
      <View style={styles.container}>
        <Spacer position="bottom" size="medium" />
        <FlatListContainer>
          <CategoryList
            showsVerticalScrollIndicator={false}
            data={genres}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({item, index}) => {
              return (
                <ToggleSelectionComponent
                  title={item.data.name}
                  value={toggleArray[index]}
                  onValueChange={value => updateArray(value, index)}
                />
              );
            }}
          />
        </FlatListContainer>
      </View>
    </SafeArea>
  );
}

export default GenresScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 20,
    marginRight: 5,
    marginTop: 20,
    marginBottom: 20,
  },
});
