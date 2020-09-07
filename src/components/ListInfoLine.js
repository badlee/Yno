import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

function ListInfoLine(props) {
  return (props.text ? 
    <View style={[styles.container, props.style]}>
      <Icon name={props.icon || "location-pin"} style={styles.icon4}></Icon>
      <View style={styles.rect2}>
        <Text style={styles.loremIpsum}>
          {props.text}
        </Text>
      </View>
    </View> : <View/>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    paddingTop: 5,
    alignItems: "center",
    justifyContent: "space-between"
  },
  icon4: {
    color: "rgba(128,128,128,1)",
    fontSize: 24,
    marginRight: 10
  },
  rect2: {
    // height: 30,
    paddingBottom: 2,
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
    borderBottomColor: "#000000",
    // borderBottomWidth: 1
  },
  loremIpsum: {
    fontFamily: "roboto-regular",
    color: "#121212",
    // height: 16,
    flex: 1
  }
});

export default ListInfoLine;
