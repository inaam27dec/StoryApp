import {Text, View} from 'react-native';
import styled from 'styled-components';

export const MainContainer = styled(View)`
  margin: 20px;
`;

export const RowView = styled(View)`
  flex-direction: column;
`;
export const RowViews = styled(View)`
  flex-direction: row;
`;

export const TopHeading = styled(Text)`
  font-family: ${props => props.theme.fonts.Poppins_Regular};
  font-weight: 600;
  font-size: 24px;
  color: ${props => props.theme.colors.ui.black};
`;

export const SuezHeading = styled(Text)`
  font-family: ${props => props.theme.fonts.suez_one};
  color: ${props => props.theme.colors.ui.black};
  font-size: 41px;
  font-weight: 400;
`;

export const SubHeading = styled(Text)`
  font-family: ${props => props.theme.fonts.Poppins_Regular};
  font-weight: 600;
  font-size: 20px;
  color: ${props => props.theme.colors.ui.black};
`;

export const GrayLabel = styled(Text)`
  font-family: ${props => props.theme.fonts.Poppins_Regular};
  font-weight: 600;
  font-size: 17px;
  color: ${props => props.theme.colors.ui.gray};
`;
