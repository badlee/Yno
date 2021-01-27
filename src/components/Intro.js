import React, { Component } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import Image from './Image';
import API from "../../API";

const windowWidth = Dimensions.get('window').width;
const width = Dimensions.get('window').width * 0.95;
function Intro({style, item : {path,meta}}) {
  return (
    <View style={[styles.scrollArea, style, {backgroundColor:meta.pageColor}]}>
          <View style={{
            flex: 1,
          }}></View>
          <Text style={[styles.loremIpsum,{color:meta.textColor}]}>{meta.title}</Text>
          <Image
            source={{uri:API.getAssetUri(path)}}
            resizeMode="contain"
            resizeMethod="resize"
            style={styles.image1}
          ></Image>
          <Text style={[styles.loremIpsum1,{color:meta.textColor}]}>
            {meta.description}
          </Text>
          <View style={{
            flex: 1,
          }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollArea: {
    backgroundColor: "rgba(230, 230, 230,1)",
    flex: 1,
    padding: 0,
    overflow:"hidden",
    paddingBottom: "10%",
    paddingTop: "10%"
  },
  scrollArea_contentContainerStyle: {
    height: Dimensions.get('window').height,
    justifyContent: "center",
    alignItems: "center"
  },
  loremIpsum: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 24,
    margin: 15,
    textAlign: "center",
  },
  image1: {
    width: width,
    height: width,
    margin: 15,
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: "transparent",

  },
  loremIpsum1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    fontSize: 15,
    // height: 200,
    width: width,
    margin: 15,
    padding: "5%",
    paddingBottom: "10%"
  }
});

export default Intro;
