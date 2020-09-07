import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import API from "../../API";
import { Circle } from 'react-native-animated-spinkit'
import SvgUri from 'expo-svg-uri';
import {Context,displayMeter,getDistanceFromLatLonInKm} from "../context/LocationContext";
import {navigate } from '../../Navigation';
import Image from "../components/Image";


function SearchItem(props) {
  var item = props.item;
  const { myLocation,isGpsLocation } = React.useContext(Context);
  var distance = isGpsLocation && item?.position?.lat &&  item?.position?.lng ?  displayMeter(getDistanceFromLatLonInKm(
    item?.position?.lat, item?.position?.lng,
    myLocation.coords.latitude,
    myLocation.coords.longitude,
  )) : "";
  return (
    <View style={[styles.container, props.style]}>
      <TouchableOpacity style={styles.button} onPress={()=>{
            navigate("Fiche",item);
      }}>
        <Image
          source={!!(item?.logo?.path) ? {uri:API.getAssetUri(item.logo.path)} : require("../assets/images/icon2.png")}
          resizeMode="contain"
          style={styles.image}
        ></Image>
        <View style={styles.rect4}>
          <Text style={styles.nom}>{item.nom}</Text>
          <Text style={styles.adresse}>{item.adresse}</Text>
          <View style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingLeft: 10,
            // paddingBottom: 10
          }}>
            <View style={{
              paddingTop: 2
            }}>
              { !!(item?.categorie?.icon?.path) && /.svg$/.test(item.categorie.icon.path) ?
                <SvgUri
                  width={styles.iconCategorie.width}
                  height={styles.iconCategorie.height}
                  source={{uri:API.getAssetUri(item.categorie.icon.path)}}
                /> : 
                <Image
                  loadingIndicatorSource={<Circle />}
                  source={ !!(item?.categorie?.icon?.path) ? {uri:API.getAssetUri(item.categorie.icon.path)} : require("../assets/images/icon.png")}
                  resizeMode="contain"
                  style={[styles.image,styles.iconCategorie]}
                />
              }
            </View>
            <View style={{height: 3, width: 3, padding:0, margin: 0}}></View>
            <Text style={styles.categorie}>
              {item?.categorie?.nom ?? "Pas de categorie"}
            </Text>
          </View>
          <View style={[styles.rect6,styles.rect5]}>

            {distance != "" && <Text style={styles.distance}>Distance {distance}</Text>}
            <View style={styles.spacer}></View>
            <Text style={styles.text}>{item.horaires}</Text>
          </View>
        </View>
        <Icon name="chevron-thin-right" style={styles.icon}></Icon>
      </TouchableOpacity>
      <View style={styles.rect8}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    margin: 5,
    overflow: "hidden",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
    borderWidth :1,
    borderColor : "transparent",
    borderBottomColor: "#C2C2C2",
    borderBottomWidth : 1,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    alignSelf: "stretch"
  },
  image: {
    width: 52,
    height: 52,
    margin: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 10,
    backgroundColor: "transparent"
  },
  rect4: {
    flex: 1,
    alignSelf: "stretch",
    padding: 5
  },
  nom: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 17,
    height: 25,
    alignSelf: "stretch"
  },
  adresse: {
    fontFamily: "roboto-regular",
    color: "#121212",
    height: 15,
    fontSize: 12,
    alignSelf: "stretch"
  },
  categorie: {
    fontFamily: "roboto-regular",
    color: "#121212",
    height: 15,
    width: "100%",
    fontSize: 12,
    alignSelf: "stretch"
  },
  rect6: {
    flex: 1,
    alignSelf: "stretch",
  },
  rect5: {
    alignSelf: "stretch",
    flexDirection: "row",
    height: 15,
    paddingTop: 7
  },
  distance: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 10,
    height: 15,
  },
  spacer: {
    flex: 1,
    alignSelf: "stretch"
  },
  text: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 10,
    height: 15
  },
  iconCategorie : {
    width: 12,
    height: 12,
    // backgroundColor: "red",
  },
  icon: {
    color: "rgba(0,0,0,0.65)",
    fontSize: 20
  },
  rect8: {
    backgroundColor: "#E6E6E6",
    alignSelf: "stretch",
    height: 1,
    paddingTop: 0,
    marginTop: 5,
    marginBottom: 0
  }
});

export default SearchItem;
