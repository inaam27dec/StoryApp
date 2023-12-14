import React, {useEffect, useState} from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styled from 'styled-components';
import PurpleButton from '../../../../components/utility/PurpleButton.component';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';
import * as RNIap from 'react-native-iap';
import PurpleBorderedButton from '../../../../components/utility/purple.bordered.button';
import CustomActivityIndicator from '../../../../components/utility/activity.indicator.component';
import CheckBox from '@react-native-community/checkbox';
import {Spacer} from '../../../../components/spacer/spacer.component';

function SubscriptionScreen({visible, onSubscriptionSelected, onCancelTapped}) {
  const [showModal, setShowModal] = useState(visible);
  const [yearlyCheck, setyearlyCheck] = useState(false);
  const [monthlyCheck, setmonthlyCheck] = useState(true);

  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);

  const itemSkus = Platform.select({
    ios: ['com.readrly.iap.month', 'com.readrly.iap.year'],
    android: ['com.readrly.iap.monthly', 'com.readrly.iap.yearly'],
  });

  const [selectedInAppPurchases, setSelectedInAppPurchases] =
    useState('monthly');
  let purchaseUpdateSubscription = null;
  let purchaseErrorSubscription = null;

  const monthlyPrice = '3.99';
  const yearlyPrice = '39.99';

  const Title = styled(Text)`
    font-size: 23px;
    font-family: ${props => props.theme.fonts.Poppins_Regular};
    font-weight: 500;
  `;

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      setmonthlyCheck(true);
      setyearlyCheck(false);
    } else {
      setShowModal(false);
    }
  };

  useEffect(() => {
    console.log('subscription screen useEffect1', selectedInAppPurchases);
    setSelectedInAppPurchases('monthly');
    toggleModal();
    initilizeIAPConnection();
  }, [visible]);

  const initilizeIAPConnection = async () => {
    await RNIap.initConnection()

      .then(async connection => {
        console.log('IAP result', connection);

        getItems();
      })

      .catch(err => {
        console.warn(`IAP ERROR ${err.code}`, err.message);
      });

    await RNIap.flushFailedPurchasesCachedAsPendingAndroid()

      .then(async consumed => {
        console.log('consumed all items?', consumed);
      })
      .catch(err => {
        console.warn(
          `flushFailedPurchasesCachedAsPendingAndroid ERROR ${err.code}`,
          err.message,
        );
      });
  };

  const getItems = async () => {
    try {
      console.log('itemSubs ', itemSkus);

      const Products = await RNIap.getSubscriptions({skus: itemSkus})
        .then(response => {
          console.log(
            'These are In APP Purchases Subscription products 1',
            response,
          );

          let products = response;
          if (response.length !== 0) {
            if (Platform.OS === 'android') {
              //Your logic here to save the products in states etc
              // let offerTokenMonthly =
              //   response[0]['subscriptionOfferDetails'][0]['offerToken'];
              // console.log('json = ', offerTokenMonthly);
              setProductList(products);
            } else if (Platform.OS === 'ios') {
              // your logic here to save the products in states etc
              // Make sure to check the response differently for android and ios as it is different for both
              setProductList(products);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (err) {
      console.log('Error in getItems');
      console.warn(err.code, err.message, err);
    }
  };

  useEffect(() => {
    initilizeIAPConnection();

    // if (visible) {}

    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async purchase => {
        // console.log('purchase ===========', purchase);

        setLoading(false);
        const receipt = purchase.transactionReceipt;
        if (Platform.OS === 'android') {
          console.log('Android purchase receipt ===', receipt);
        }

        // if (receipt) {
        try {
          if (Platform.OS === 'ios') {
            // RNIap.finishTransactionIOS({purchase.transactionId});
          } else if (Platform.OS === 'android') {
            // await RNIap.consumeAllItemsAndroid(purchase.purchaseToken);
            // await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
          }

          await RNIap.finishTransaction({purchase}, true);
          onSubscriptionSelected(
            purchase.productId,
            purchase.transactionDate,
            Platform.OS,
            selectedInAppPurchases,
            selectedInAppPurchases === 'monthly' ? monthlyPrice : yearlyPrice,
            purchase.transactionReceipt,
          );
        } catch (ackErr) {
          console.log('ackErr INAPP>>>>', ackErr);
        }
        // }
      },
    );

    purchaseErrorSubscription = RNIap.purchaseErrorListener(error => {
      setLoading(false);
      onCancelTapped();
      console.log('purchaseErrorListener INAPP>>>>', error);
    });

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();

        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();

        purchaseErrorSubscription = null;
      }
    };
  }, []);

  const requestSubscriptionAndroid = async (sku, offerToken) => {
    const subscriptionRequest = {
      subscriptionOffers: [
        {
          sku,
          offerToken,
        },
      ],
    };

    try {
      await requestSubscription(subscriptionRequest)
        .then(async result => {
          console.log('IAP request subscription product Id', sku);
          console.log('result', result);
          if (Platform.OS === 'android') {
            // await RNIap.consumePurchaseAndroid(result.purchaseToken);
            // await RNIap.consumePurchase(result.purchaseToken);
          } else if (Platform.OS === 'ios') {
          }
        })
        .catch(err => {
          console.log('catch result error');
          console.log({message: `[${err.code}]: ${err.message}`, err});
        });
    } catch (error) {
      console.log('try catch error');
      console.log({message: `[${error.code}]: ${error.message}`, error});
    }
  };

  const requestSubscription = async sku => {
    setLoading(true);
    try {
      await RNIap.requestSubscription(sku)
        .then(async result => {
          console.log('IAP request subscription product Id', sku);
          console.log('result', result);
          if (Platform.OS === 'android') {
            // await RNIap.consumePurchaseAndroid(result.purchaseToken);
            // await RNIap.consumePurchase(result.purchaseToken);
          } else if (Platform.OS === 'ios') {
          }
        })
        .catch(err => {
          console.log('catch result error');
          console.log({message: `[${err.code}]: ${err.message}`, err});
        });
    } catch (error) {
      console.log('try catch error');
      console.log({message: `[${error.code}]: ${error.message}`, error});
    }
  };

  const onChangeMonthly = () => {
    setmonthlyCheck(true);
    setyearlyCheck(false);
    console.log('This is month subscription', itemSkus[0]);
    setSelectedInAppPurchases('monthly');
  };

  const onChangeYearly = () => {
    setyearlyCheck(true);
    setmonthlyCheck(false);
    console.log('This is year subscription', itemSkus[1]);
    setSelectedInAppPurchases('yearly');
  };

  return (
    <View>
      <Modal
        supportedOrientations={['portrait', 'landscape']}
        transparent
        visible={showModal}>
        <View style={styles.modalBackground}>
          {/* <ScrollView> */}
          <View style={styles.mainContainer}>
            {loading && <CustomActivityIndicator animate={loading} />}
            <View
              style={{
                marginTop: 15,
                marginBottom: 0,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Title>Choose a payment plan</Title>
            </View>
            <Text style={styles.description}>
              Get unlimited stories. Subscription is auto-renewable which means
              that once purchased it will be auto-renewed every month until you
              cancel it 24 hours prior to the end of the current period.
            </Text>
            <TouchableOpacity
              onPress={onChangeMonthly}
              style={[
                styles.subscriptionMainContainer,
                {
                  backgroundColor: monthlyCheck
                    ? colors.ui.lightPurple
                    : 'transparent',
                  borderColor: monthlyCheck
                    ? colors.ui.black
                    : colors.ui.purple,
                },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    marginRight: 25,
                    alignself: 'center',
                    justifyContent: 'center',
                  }}>
                  <CheckBox
                    value={monthlyCheck}
                    onValueChange={onChangeMonthly}
                    style={{height: 23, width: 23}}
                    boxType="circle"
                    onFillColor="#fff"
                    onCheckColor={colors.ui.purple}
                    onTintColor={colors.ui.lightPurple}
                    tintColor={colors.ui.purple}
                    onAnimationType="bounce"
                    offAnimationType="bounce"
                    lineWidth={1}
                  />
                </View>
                <Text style={styles.newPrice}>${monthlyPrice}</Text>
                <Text style={styles.perDuration}>/month</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.description}>
              Get unlimited stories. Subscription is auto-renewable which means
              that once purchased it will be auto-renewed every year until you
              cancel it 24 hours prior to the end of the current period.
            </Text>
            <TouchableOpacity
              onPress={onChangeYearly}
              style={[
                styles.subscriptionMainContainer,
                {
                  backgroundColor: yearlyCheck
                    ? colors.ui.lightPurple
                    : 'transparent',
                  borderColor: yearlyCheck ? colors.ui.black : colors.ui.purple,
                },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    marginRight: 25,
                    alignself: 'center',
                    justifyContent: 'center',
                  }}>
                  <CheckBox
                    value={yearlyCheck}
                    onValueChange={onChangeYearly}
                    style={{height: 23, width: 23}}
                    boxType="circle"
                    onFillColor="#fff"
                    onCheckColor={colors.ui.purple}
                    onTintColor={colors.ui.lightPurple}
                    tintColor={colors.ui.purple}
                    onAnimationType="bounce"
                    offAnimationType="bounce"
                    lineWidth={1}
                  />
                </View>

                <Text style={styles.newPrice}>${yearlyPrice}</Text>
                <Text style={styles.perDuration}>/year</Text>
              </View>
            </TouchableOpacity>
            <Spacer size={'large'} position={'bottom'} />
            <PurpleButton
              title={'Continue'}
              paddingVertical={5}
              paddingHorizontal={12}
              marginBottom={10}
              isSelected={true}
              buttonWidth={'85%'}
              onPressed={() => {
                if (Platform.OS === 'ios') {
                  requestSubscription({
                    sku:
                      selectedInAppPurchases === 'monthly'
                        ? itemSkus[0]
                        : itemSkus[1],
                  });
                } else {
                  console.log(
                    'selectedInAppPurchases ===',
                    selectedInAppPurchases,
                  );
                  if (selectedInAppPurchases === 'monthly') {
                    requestSubscriptionAndroid(
                      itemSkus[0],
                      productList[0]['subscriptionOfferDetails'][0][
                        'offerToken'
                      ],
                    );
                  } else {
                    requestSubscriptionAndroid(
                      itemSkus[1],
                      productList[1]['subscriptionOfferDetails'][0][
                        'offerToken'
                      ],
                    );
                  }
                }
              }}
            />
            <PurpleBorderedButton
              title={'Cancel'}
              paddingVertical={5}
              paddingHorizontal={12}
              isSelected={true}
              buttonWidth={'85%'}
              onPressed={() => {
                onCancelTapped();
              }}
            />
          </View>
          {/* </ScrollView> */}
        </View>
      </Modal>
      {/* // )} */}
    </View>
  );
}

export default SubscriptionScreen;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  topContainer: {
    margin: 20,
  },
  buttonContainer: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    height: Platform.OS === 'android' ? 680 : 630,
    width: '85%',
    alignItems: 'center',
    backgroundColor: colors.ui.white,
    borderRadius: 15,
    paddingBottom: 20,
  },
  picker: {
    backgroundColor: colors.ui.white,
    height: '100%',
    width: '100%',
  },
  subscriptionMainContainer: {
    width: '85%',
    borderColor: colors.ui.purple,
    borderWidth: 1,
    borderRadius: 20,
    marginLeft: 4,
    marginRight: 5,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    marginBottom: 20,
  },
  durationText: {
    fontFamily: fonts.Poppins_Regular,
    fontSize: 18,
    fontWeight: '500',
  },
  newPrice: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: 20,
    fontWeight: '500',
  },
  perDuration: {
    fontFamily: fonts.Poppins_Regular,
    fontSize: 20,
    color: colors.ui.black,
    textAlign: 'center',
  },
  oldPrice: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: 22,
    color: colors.ui.gray,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  description: {
    marginTop: 20,
    marginBottom: Platform.OS === 'android' ? 10 : 20,
    marginRight: 12,
    marginLeft: 12,
    fontFamily: fonts.Poppins_Medium,
    fontSize: 14,
    color: colors.ui.gray,
    textAlign: 'center',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});
