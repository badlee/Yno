import React from 'react';
import {AsyncStorage, StyleSheet } from 'react-native';
import Intro from "../components/Intro";
import AppIntroSlider from 'react-native-app-intro-slider';
import { replace } from '../../Navigation';
import {Context} from "../context/LocationContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "space-between"
  },
  intro: {
    alignSelf: "stretch",
    flex: 1
  },
  dots: {
    flexDirection: "row",
    height: 30,
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "center"
  },
  dot: {
    height: 16,
    width: 15,
    margin: 2
  },
  dotSelected: {
    height: 16,
    width: 15,
    margin: 2
  },
  dot2: {
    height: 16,
    width: 15,
    margin: 2
  },
  rect3: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    alignSelf: "stretch"
  },
  button2: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    paddingLeft: 15,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  ignorer: {
    fontFamily: "roboto-700",
    color: "#121212"
  },
  button: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  suivant2: {
    fontFamily: "roboto-700",
    color: "#121212",
    textAlign: "right"
  },
  rect: {
    justifyContent: "center",
    alignItems: "center",
    height: 20,
    alignSelf: "stretch"
  }
});

export default class App extends React.Component {
  static contextType = Context;
  _renderItem ({ item }){
    return <Intro item={item} style={styles.intro}></Intro>;
  }
  async _onDone () {
    await AsyncStorage.setItem('intro',"1");
    replace(this?.context?.userToken ? "Recherche" : "Login");
  }
  render() {
    return <AppIntroSlider nextLabel="Suivant" doneLabel="S'identifier" renderItem={this._renderItem} data={global.config.slides} onDone={this._onDone}/>;
  }
}