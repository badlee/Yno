import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, TextInput } from "react-native";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {pop} from '../../Navigation';
import { Constants } from "react-native-unimodules";

function SearchBar(props) {
  return (
    <View style={[styles.container,{
      backgroundColor: global.config.color1,
    }, props.style]}>
      <View style={{
        paddingVertical: 10,
      }}></View>
      <View style={styles.rect1}>
        <View style={styles.leftIconButtonRow}>
          <TouchableOpacity
            onPress={()=>{
              pop();
            }}
            style={styles.leftIconButton}
          >
            <MaterialCommunityIconsIcon
              name="arrow-left"
              style={styles.leftIcon}
            ></MaterialCommunityIconsIcon>
          </TouchableOpacity>
          <TextInput
            editable={props.editable || false}
            placeholder={props.text || "Search"}
            placeholderTextColor="#ffffff"
            style={[styles.inputStyle, props.inputStyle]}
          ></TextInput>
        </View>
        <View style={styles.leftIconButtonRowFiller}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    shadowColor: "#111",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.2,
    elevation: 3,
    height: 56 + Constants.statusBarHeight,
    width: "100%"
  },
  rect1: {
    flexDirection: "row",
    backgroundColor: "transparent",
    alignItems: "center",
    flex: 1
  },
  leftIconButton: {
    padding: 11,
    paddingRight: 0,
    marginTop: 1
  },
  leftIcon: {
    backgroundColor: "transparent",
    color: "#FFFFFF",
    fontSize: 24
  },
  inputStyle: {
    height: 48,
    color: "#FFFFFF",
    paddingRight: 5,
    fontSize: 16,
    alignSelf: "flex-start",
    width: 263,
    lineHeight: 16,
    marginLeft: 10
  },
  leftIconButtonRow: {
    height: 48,
    flexDirection: "row",
    marginLeft: 5,
    marginTop: 4
  },
  leftIconButtonRowFiller: {
    flex: 1,
    flexDirection: "row"
  },
  rightIconButton: {
    padding: 11,
    alignItems: "center",
    marginRight: 5,
    marginTop: 5
  },
  rightIcon: {
    backgroundColor: "transparent",
    color: "#FFFFFF",
    fontSize: 24
  }
});

export default SearchBar;
