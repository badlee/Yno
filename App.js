import * as React from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LocationContext from "./src/context/LocationContext";
import Fiche from "./src/screens/Fiche";
import Liste from "./src/screens/Liste";
import Profil from "./src/screens/Profil";
import Recherche from "./src/screens/Recherche";
import Register from "./src/screens/Register";
import Slider from "./src/screens/Slider";
import Login from "./src/screens/Login";
import SplashScreen from "./src/screens/SplashScreen";
import * as Font from "expo-font";
import API from './API';
import {replace, navigationRef } from './Navigation';
const CONFIG = require("./config.json");
import {AppLoading} from 'expo';
var Stack = createStackNavigator();
import * as ScreenOrientation from 'expo-screen-orientation';
var SPLASH = require("./src/assets/images/splash.png");
global.colors = {
  blue : "rgba(45,176,221,1)",
  orange : "rgba(241,117,34,1)",
  SPLASH
};



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
  await Promise.all([
    Font.loadAsync({
      "roboto-regular": require("./src/assets/fonts/roboto-regular.ttf"),
      "roboto-700": require("./src/assets/fonts/roboto-700.ttf")
    })
  ]);
  await API.init(CONFIG);
}

function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}



export default function App() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  if (!isLoadingComplete) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      ></AppLoading>
    );
  } else {
    return  <ReelApp />;
  }
}