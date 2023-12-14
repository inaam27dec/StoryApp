import {React} from 'react';

export const InAppConstants = {
  iOSSecretPassword: 'e6bdb7a390484d9ab98528ca253f5a93',
  iOSSandboxURL: 'https://sandbox.itunes.apple.com/verifyReceipt',
  iOSProductionURL: 'https://buy.itunes.apple.com/verifyReceipt',
};

export const StoryConstants = {
  RubyNarratorId: 'en-UK-ruby',
};

export const AppConstants = {
  appName: 'Readerly',
  userID: 'userID',
  isAdminLogin: 'isAdminLogin',
  isUserLogin: 'isUserLogin',
  userPreferenceID: 'userPreferenceID',
  userImageURL: 'userImage',
  userHighlightPreference: 'userHighlightPreference',
  userMaleVoicePreference: 'userMaleVoicePreference',
  userFemaleVoicePreference: 'userFemaleVoicePreference',
  userStoryPreference: 'userStoryPreference',
  isSubscriptionEnabled: 'isSubscriptionEnabled',
  isOffline: 'isOffline',
};

export const WebURLS = {
  // privacyPolicy: 'https://www.readrly.io/privacy-policy',
  // termsOfUse: 'https://www.readrly.io/terms-and-conditions',
  termsOfUse: 'https://www.readrly.io/terms-and-conditions-mobile',
  privacyPolicy: 'https://www.readrly.io/privacy-policy-mobile',
};

export const MLURLS = {
  apiEndpoint: 'http://3.239.7.98/api/get_recommendations',
};

export const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

export const Images = {
  cross: require('../../assets/remove.png'),
  placeholder: require('../../assets/placeholder.png'),
  star_selected: require('../../assets/star_selected.png'),
  star_unselected: require('../../assets/star_unselected.png'),
  bell: require('../../assets/bell_icon.png'),
  bell_purple: require('../../assets/bell_purple.png'),
  bookmark: require('../../assets/bookmark_icon.png'),
  bookmark_selected: require('../../assets/bookmark_selected.png'),
  bookmark_unselected: require('../../assets/bookmark_unselected.png'),
  latest_stories_selected: require('../../assets/latest_stories_selected.png'),
  latest_stories_unselected: require('../../assets/latest_stories_unselected.png'),
  bookmark_purple: require('../../assets/bookmark_purple.png'),
  setting: require('../../assets/setting_icon.png'),
  setting_purple: require('../../assets/settings_purple.png'),
  back: require('../../assets/back_icon.png'),
  child_dummy: require('../../assets/child_dummy.png'),
  child_dummy_large: require('../../assets/child_dummy_large.png'),
  user: require('../../assets/user.png'),
  user_selected: require('../../assets/user_selected.png'),
  user_unselected: require('../../assets/user_unselected.png'),
  log_out: require('../../assets/log-out.png'),
  arrow_right: require('../../assets/arrow_right.png'),
  search: require('../../assets/search.png'),
  home: require('../../assets/home_icon.png'),
  home_unselected: require('../../assets/home_unselected.png'),
  home_selected: require('../../assets/home_selected.png'),
  category_dummy: require('../../assets/category_dummy.png'),
  lock_purple: require('../../assets/lock_purple.png'),
  security_purple: require('../../assets/security_purple.png'),
  help_purple: require('../../assets/help_purple.png'),
  about_purple: require('../../assets/about_purple.png'),
  unhappy: require('../../assets/unhappy.png'),
  eye: require('../../assets/eye.png'),
  concern: require('../../assets/concern.png'),
  irreverent: require('../../assets/irreverent.png'),
  satisfaction: require('../../assets/satisfaction.png'),
  happy: require('../../assets/happy.png'),
  leaderboard: require('../../assets/leaderboard_icon.png'),
  read_story: require('../../assets/read_story_dummy.png'),
  apple_icon: require('../../assets/apple_2.png'),
  search_bar: require('../../assets/search-bar.png'),
  active: require('../../assets/active_icon.png'),
  lock_icon: require('../../assets/lock_icon.png'),
  termsCondition: require('../../assets/terms_condition.png'),
  privacyPolicy: require('../../assets/privacy_policy.png'),
  trashIcon: require('../../assets/trash_icon.png'),
  certificate: require('../../assets/certificate.png'),
  download_selected: require('../../assets/download_selected.png'),
  download_unselected: require('../../assets/download_unselected.png'),
};

const StatusType = {
  active: 'active',
  pending: 'pending',
  inactive: 'inactive',
};

export const SubscriptionType = {
  monthly: 'monthly',
  yearly: 'yearly',
};

export const DateFormats = {
  T_FORMAT: 'YYYY-MM-DDTHH:mm:ss',
};
