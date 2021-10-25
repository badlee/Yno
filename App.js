// In App.js in a new project

import * as React from 'react';
import { View, Text, StatusBar, LogBox } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LocationContext from "./src/context/LocationContext";
import Fiche from "./src/screens/Fiche";
import Liste from "./src/screens/Liste";
import Profil from "./src/screens/Profil";
import Recherche from "./src/screens/Recherche";
import Register from "./src/screens/Register";
import Slider from "./src/screens/Slider";
import Login from "./src/screens/Login";
import SplashScreen from "./src/screens/SplashScreen";
import {navigationRef } from './Navigation';
import AppLoading from 'expo-app-loading';
import * as ScreenOrientation from 'expo-screen-orientation';
var SPLASH = require("./src/assets/images/splash.png");
global.colors = {
  SPLASH
};

const LoadingApp = function(){
  // console.disableYellowBox = true;
  // LogBox.ignoreAllLogs(true);
  LogBox.install();
   
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  if (isLoadingComplete) {
    return <ReelApp/>;
  } else {
    return  <AppLoading
      startAsync={loadResourcesAsync}
      onError={handleLoadingError}
      onFinish={() => handleFinishLoading(setLoadingComplete)}
    ></AppLoading>;
  }
}

function ReelApp(props) {
  return (
    <NavigationContainer ref={navigationRef}>
        <LocationContext>
          <Stack.Navigator headerMode='none'>
            <Stack.Screen key="Splash-screen" name="SplashScreen" component={SplashScreen} />
            <Stack.Screen key="Slider-screen" name="Slider" component={Slider} />
            <Stack.Screen key="Screen-login" name="Login" component={Login} />
            <Stack.Screen key="Screen-register" name="Register" component={Register} />
            <Stack.Screen key="Recherche-screen" name="Recherche" component={Recherche} />
            <Stack.Screen key="Liste-screen" name="Liste" component={Liste} />
            <Stack.Screen key="Fiche-screen" name="Fiche" component={Fiche} />
            <Stack.Screen key="Profil-screen" name="Profil" component={Profil} />
          </Stack.Navigator>
        </LocationContext>
    </NavigationContainer>
  );
}

async function loadResourcesAsync() {
  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  StatusBar.setBarStyle("light-content");
}

function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

function HomeScreen() {
  return (
    <View style={{ backgroundColor: 'red', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{color: "#FF0000"}}>Home Screen</Text>
    </View>
  );
}
function DetailsScreen() {
  return (
    <View style={{ backgroundColor: 'red', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
     </Stack.Navigator>
    </NavigationContainer>
  );
}

export default LoadingApp;