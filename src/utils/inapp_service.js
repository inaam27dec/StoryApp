import axios from 'axios';
import {Platform} from 'react-native';
import * as RNIap from 'react-native-iap';
import {AppConstants, InAppConstants} from '../constants/app.constants';
import {getItem, setItem} from '../constants/helper';
import {addSubscription, getAllSubscriptions} from '../constants/social.helper';

export const checkEitherSubscriptionExpiredNew = async () => {
  if (Platform.OS === 'ios') {
    console.log('inside iOS Subscription check');
    const latestAvailableReceiptInfo =
      await getReceiptInfoIfExistAnyInFirebase();

    if (latestAvailableReceiptInfo === null) {
      console.log('subscription info not found from firebase');
      await setItem(AppConstants.isSubscriptionEnabled, false);
      return false;
    } else {
      console.log(
        'subscription info found from firebase, calling shahzaib api to verify',
      );
      let isSubscriptionActive = await getVerifyReceiptResponseFromAPI(
        latestAvailableReceiptInfo,
      );
      console.log('isSubscriptionActive ===', isSubscriptionActive);
      return isSubscriptionActive;
    }
  } else {
    console.log('inside android Subscription check');
    const availablePurchases1 = await RNIap.getAvailablePurchases();
    console.log('availablePurchases ===', availablePurchases1);
    if (
      availablePurchases1 === [] ||
      availablePurchases1.length === 0 ||
      availablePurchases1 === undefined
    ) {
      console.log('availablePurchases1 did not return data');
      await setItem(AppConstants.isSubscriptionEnabled, false);
      return false;
    } else {
      console.log('savailablePurchases1 returns data');
      await setItem(AppConstants.isSubscriptionEnabled, true);
      return true;
    }
  }
};

const getReceiptInfoIfExistAnyInFirebase = async () => {
  let dataArray = await getAllSubscriptions();
  let userID = await getItem(AppConstants.userID);
  let userSubscription = dataArray.filter(item => item.data.userID === userID);
  if (
    userSubscription === null ||
    userSubscription === undefined ||
    userSubscription.length === 0
  ) {
    return null;
  } else {
    return userSubscription[0].data;
  }
};

export const getVerifyReceiptResponseFromAPI = async subscriptionInfo => {
  var isProduction = false;
  if (__DEV__) {
    isProduction = false;
  } else {
    isProduction = true;
  }

  const response = await axios.post(
    'https://us-central1-readrly.cloudfunctions.net/verifyInAppPurchaseApi/verifyReceipt',
    {
      receipt_data: subscriptionInfo.transactionReceipt,
      password: InAppConstants.iOSSecretPassword,
      exclude_old_transactions: true,
      is_Production: isProduction,
      is_From_iOS: Platform.OS === 'ios' ? true : false,
    },
  );
  console.log("get shahzaib's api response", response.data);
  if (response != null && response.data.data.latest_receipt_info !== null) {
    var latestReceiptInfo = response.data.data.latest_receipt_info;

    updateLatestReceiptOnFirebaseAfterShahzaibAPICall(
      subscriptionInfo,
      response.data.data.latest_receipt,
    );

    console.log('latestReceiptInfo ===', latestReceiptInfo);
    latestReceiptInfo = latestReceiptInfo.filter(
      item => item.cancellation_date == null,
    );

    if (latestReceiptInfo == null) {
      await setItem(AppConstants.isSubscriptionEnabled, false);
      return false;
    } else {
      const isSubValid = !!latestReceiptInfo.find(receipt => {
        const expirationInMilliseconds = Number(receipt.expires_date_ms);
        const nowInMilliseconds = Date.now();
        return expirationInMilliseconds > nowInMilliseconds;
      });

      await setItem(AppConstants.isSubscriptionEnabled, isSubValid);
      return isSubValid;
    }
  } else {
    await setItem(AppConstants.isSubscriptionEnabled, false);
    return false;
  }
};

const updateLatestReceiptOnFirebaseAfterShahzaibAPICall = async (
  subscriptionInfo,
  latestReceipt,
) => {
  console.log('calling addSubscription from inAppService screen');

  await addSubscription(
    subscriptionInfo.productId,
    subscriptionInfo.transactionDateTimeStamp,
    subscriptionInfo.deviceType,
    subscriptionInfo.subscriptionType,
    subscriptionInfo.price,
    latestReceipt,
  ).then(data => {
    console.log(
      'updated latest receipt for subscription to DB ===========',
      data,
    );
  });
};
