import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import axios from 'axios';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { ThemeProvider, theme } from './theme';
import { CheckoutStack, DrawerNavigator } from './navigation/Navigator';
import { createStackNavigator } from 'react-navigation-stack';
import NavigationService from './navigation/NavigationService';
import { onAppStart } from './helper/app';
import { HeaderTop, Spinner } from './components/common';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-navigation';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import * as routes from './navigation/routes';
import EmiratesSelection from './components/emiratesSelection/EmiratesSelection';
import { createAppContainer } from 'react-navigation';
import { Alert, AppState, BackHandler } from 'react-native';

let defaultRoute = '';

onAppStart(store);

const App = () => {
  const [isLoading, setLoading] = useState(true);

  
  const backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: async () => {
        await AsyncStorage.setItem("isRegionSelected","false");
        BackHandler.exitApp();
      }}
    ]);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  useEffect(() => {
    SplashScreen.hide();
    
  });
  const checkIsRegionSelected = async () => {
    // let isRegionSelected = await AsyncStorage.getItem("isRegionSelected")

    // return isRegionSelected;

    AsyncStorage.getItem('isRegionSelected').then(result => {
      // console.log(
      //   'checkIsRegionSelected',
      //   'checkIsRegionSelected==> ' + JSON.stringify(result),
      // );
      defaultRoute =
        result === 'true' ? null : routes.NAVIGATION_EMIRATES_SELECTION_SCREEN;

      // await AsyncStorage.setItem(
      //   'store',
      //   storesPerEmirates[selectedCity],
      // );

      AsyncStorage.getItem('store').then(res => {
        // console.log('storesPerEmirates', 'storesPerEmirates==> ' + res);
      });
      AsyncStorage.getItem('storeCity').then(res => {
        // console.log('storeCity', 'storeCity==> ' + res);
      });

      setLoading(false);
    });
  };
  useEffect(() => {
    checkIsRegionSelected();
    
    requestUserPermission();
    NotificationListener();
  }, [requestUserPermission]);

  signOutUser = async () => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      console.log('e=====>', e);
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFcmToken();
      //console.log('Authorization status:', authStatus);
    }
    
    // else if(!authStatus==1){
    //   signOutUser()
    // }
  };

  const getFcmToken =  async () => {
    
        const fcmtoken=await messaging().getToken();
   
      
      console.log('Your Firebase Token is:', fcmtoken);
    } 
  

  const NotificationListener=()=>{
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
         messaging().onMessage(async remoteMessage=>{
          console.log('remote message in foreground', remoteMessage);
         })
        }
      });
  }
  Nav = createStackNavigator(
    {
      [routes.NAVIGATION_DRAWER_NAVIGATOR]: DrawerNavigator,
      [routes.NAVIGATION_CHECKOUT_STACK_PATH]: CheckoutStack,
      [routes.NAVIGATION_EMIRATES_SELECTION_SCREEN]: {
        screen: EmiratesSelection,
        navigationOptions: () => ({
          headerTitle: 'SELECT STORE',
          headerTitleAlign: 'center',
        }),
      },
    },

    {
      initialRouteName: defaultRoute,
      defaultNavigationOptions: { header: () => null },
    },
  );

  Navigator = createAppContainer(Nav);

  return (
    <Provider store={store} >
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor:'#FFFFFF' }} forceInset={{ bottom: 'never' }}>
            <PersistGate loading={<Spinner />} persistor={persistor}>
                <HeaderTop />
              {isLoading === false && (
                <Navigator
                  ref={navigatorRef => {
                    NavigationService.setTopLevelNavigator(navigatorRef);
                  }}
                />
              )}
            </PersistGate>
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

// console.log('defaultRoute1222', defaultRoute);
