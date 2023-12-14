import React, {useState} from 'react';
import {Image, View} from 'react-native';
import {Searchbar} from 'react-native-paper';
import styled from 'styled-components';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../infrastructure/theme/colors';
import {Images} from '../../constants/app.constants';

const SearchContainer = styled(View)`
  padding: ${props => props.theme.space[3]};
  padding-top: 0px;
`;

const CustomSearchBar = styled(Searchbar)`
  font-family: ${props => props.theme.fonts.oswald};
  font-size: 20px;
  background-color: ${props => props.theme.colors.ui.tertiary};
  border-radius: 16px;
`;

function Search({applySearch}) {
  const [keyword, setKeyword] = useState('');

  return (
    <SearchContainer>
      <CustomSearchBar
        icon={() => (
          //   <Ionicons name="search-outline" size={20} color="#F1F1F1" />
          //   <MaterialIcons name="search" color={colors.ui.gray} size={20} />
          <Image
            // style={{
            //   tintColor: colors.ui.gray,
            // }}
            source={Images.search}
          />
        )}
        inputStyle={{marginLeft: -10}}
        value={keyword}
        placeholder="Search"
        onSubmitEditing={() => {
          applySearch(keyword);
        }}
        onChangeText={value => {
          setKeyword(value);
          if (value === '') {
            applySearch(value);
          }
        }}
      />
    </SearchContainer>
  );
}

export default Search;
