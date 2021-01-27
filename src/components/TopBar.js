import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {navigate, pop } from '../../Navigation';
import Constants from 'expo-constants';
import tinycolor from 'tinycolor2';
import Image from './Image';

function TopBar(props) {
  return (
    <View style={[styles.container,{backgroundColor: global.config.color1,}, props.style]}>
      <TouchableOpacity
            onPress={()=>{
              pop();
            }}
            style={styles.iconContainer}
          >
            <MaterialCommunityIconsIcon
              name="arrow-left"
              style={styles.leftIcon}
            ></MaterialCommunityIconsIcon>
          </TouchableOpacity>
          {!!props.noLogo == false && <View style={[styles.imageContainer,{
            borderColor: tinycolor(global.config.color2).toRgbString(),
          }, props.logoStyle]}>
            <Image
              source={props.logo || require("../assets/images/icon2.png")}
              resizeMode="contain"
              style={styles.image1}
              />
          </View>}
      <Text style={styles.leSaintMihiel3} numberOfLines={1}>
        {props.title || "Le Saint Mihiel"}
      </Text>
      { (props.hasIcon ?? true) ? <TouchableOpacity style={styles.iconContainer} onPress={()=>{
        if(props.onPress){
          return props.onPress();
        }
        navigate("Recherche");
      }}>
        <MaterialCommunityIconsIcon
          name={props.icon || "magnify"}
          style={styles.rightIcon2}
        ></MaterialCommunityIconsIcon>
      </TouchableOpacity>:null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    paddingTop: 20,
    shadowColor: "#111",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.2,
    elevation: 3,
    height: 56 + Constants.statusBarHeight,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  imageContainer : {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 10,
    borderColor: "transparent",
    borderWidth: 1,
    overflow: "hidden",
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  image1: {
    width: 32,
    height: 32,
    margin: 5,
  },
  leSaintMihiel3: {
    fontFamily: "roboto-700",
    color: "#FFFFFF",
    fontSize: 22,
    alignSelf: "center",
    paddingTop: 0,
    paddingBottom: 0,
    flex: 1
  },
  iconContainer: {
    padding: 11,
    alignItems: "center"
  },
  rightIcon2: {
    backgroundColor: "transparent",
    color: "#FFFFFF",
    fontSize: 30
  },
  leftIcon: {
    backgroundColor: "transparent",
    color: "#FFFFFF",
    fontSize: 24
  },
});

export default TopBar;
