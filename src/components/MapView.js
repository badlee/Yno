import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import ReactNativeMaps from "react-native-maps";
import {Context} from "../context/LocationContext";
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    overflow: "hidden",
    margin: 0
  },
  mapView2: {
    alignSelf: "stretch",
    flex: 1,
    margin: 0
  }
});

export default function (props) {
    const { myLocation } = React.useContext(Context);
  return (
    <View style={[styles.container, props.style]}>
      <ReactNativeMaps
        provider={ReactNativeMaps.PROVIDER_GOOGLE}
        showsUserLocation={true}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          ...(myLocation != null ? myLocation.coords :{}),
        }}
        customMapStyle={[]}
        style={styles.mapView2}
      ></ReactNativeMaps>
    </View>
  );
};
