import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import CustomActivityIndicator from '../../../../components/utility/activity.indicator.component';
import {ToolBar} from '../../../../components/utility/Toolbar';
import {Images} from '../../../../constants/app.constants';

function WebViewScreen(props) {
  const {navigation, route} = props;
  const {title} = route.params;
  const {url} = route.params;
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView>
      <View>
        <ToolBar
          showLeftIcon={true}
          leftIcon={Images.back}
          showRightIcon={false}
          heading={title}
          onLeftPressed={() => {
            navigation.pop();
          }}
          onRightPressed={() => {}}
        />
      </View>
      <View style={styles.container}>
        {loading && <CustomActivityIndicator animate={loading} />}
        <WebView
          onLoadStart={() => {
            setLoading(true);
          }}
          onLoadEnd={() => {
            setLoading(false);
          }}
          source={{
            uri: url,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default WebViewScreen;

const styles = StyleSheet.create({
  container: {
    height: '92%',
  },
});
