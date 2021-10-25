import React from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Intro from "../components/Intro";
import AppIntroSlider from 'react-native-app-intro-slider';
import { replace } from '../../Navigation';
import {Context} from "../context/LocationContext";
import Icon from 'react-native-vector-icons/Ionicons';
import tinycolor from 'tinycolor2';

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
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class App extends React.Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.item = global.config.slides[global.config.slides.length - 1];

  }
  _renderItem ({ item }){
    return <Intro key={"slide"+Math.random().toString(16).split(".")[1]} item={item} style={styles.intro}></Intro>;
  }
  async _onDone () {
    await AsyncStorage.setItem('intro',"1");
    replace(this?.context?.userToken ? "Recherche" : "Login");
  }
  _renderNextButton(){
    return (
      <View key="slide-next" style={[styles.buttonCircle,{backgroundColor: this._getColor(this.item.meta.pageColor)}]}>
        <Icon
          name="md-chevron-forward-sharp"
          color={this.item.meta.textColor || "#FFFFFF"}
          size={24}
        />
      </View>
    );
  };
  _renderDoneButton(){
    return (
      <View  key="slide-done" style={[styles.buttonCircle,{backgroundColor: this._getColor(this.item.meta.pageColor)}]}>
        <Icon
          name="md-checkmark"
          color={this.item.meta.textColor || "#FFFFFF"}
          size={24}
        />
      </View>
    );
  };
  _getColor(dotColor, reverse){
    dotColor = tinycolor(dotColor);
    return (dotColor[reverse ? "isLight" : "isDark"]() ? dotColor.lighten(15) : dotColor.darken(15)).toHexString()
  }
  render() {
    var dotColor = this._getColor(this.item.meta.pageColor);
    var dotActiveColor = this._getColor(this.item.meta.textColor);
    var borderWidth = 0;
    console.log(global.config.slides);
    return <AppIntroSlider
      // nextLabel="Suivant" 
      // doneLabel="S'identifier" 
      dotStyle ={{
        backgroundColor : dotColor,
        borderColor : dotActiveColor,
        borderWidth 
      }}
      activeDotStyle = {{
        backgroundColor : dotActiveColor,
        borderColor : dotColor,
        borderWidth
      }}
      renderDoneButton={this._renderDoneButton.bind(this)}
        renderNextButton={this._renderNextButton.bind(this)}
      renderItem={this._renderItem} 
      data={global.config.slides} onDone={this._onDone}
    />;
  }
}