import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Linking } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import API from "../../API";
import {moment, Context,displayMeter,getDistanceFromLatLonInKm} from "../context/LocationContext";
import {navigate } from '../../Navigation';
import Image from "../components/Image";
import Modal from "../components/Modal";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import tinycolor from 'tinycolor2';


function SearchItemRDV(props) {
  var item = props.item.client;
  const { myLocation } = React.useContext(Context);
  const [modal,showModal] = React.useState(false);
  return (
    <View style={[styles.container, props.style]}>
      <TouchableOpacity style={styles.button} onPress={()=>{
          showModal(true);
      }}>
        <Image
          source={!!(item?.logo?.path) ? {uri:API.getAssetUri(item.logo.path)} : require("../assets/images/icon.png")}
          resizeMode="contain"
          style={styles.image}
        ></Image>
        <View style={styles.rect4}>
          <Text style={styles.nom}>{props.item.categorie.nom}</Text>
          <Text style={[styles.adresse,{fontWeight: "bold"}]}>{item.nom}</Text>
          <View style={[styles.rect6,{
            flexDirection: "row",
            // alignItems: "flex-start",
            // justifyContent: "center",
            // paddingLeft: 0,
            // paddingBottom: 10
          }]}>
            <Text style={[styles.categorie,{width : 50}]}>Adresse : </Text>
            <View style={{height: 3, width: 3, padding:0, margin: 0}}></View>
            <Text style={styles.categorie} numberOfLines={1}>
              {item.adresse}
            </Text>
          </View>
          <View style={[styles.rect6,styles.rect5]}>
            {props.isList ? 
              <Text style={styles.text}>{ moment(props.item.date).format("DD/MM/YYYY")} ({moment(props.item.date).from(moment())})</Text>:
              <Text style={styles.text}>Rdv {moment(props.item.date).from(moment())}</Text>
            }
          </View>
        </View>
        <View style={{
          backgroundColor : props.item.reject === false ? (props.item.done == false ? "orange" : "green") : "red",
          height : 20,
          width : 60,
          borderRadius : 60,
          alignContent : "center",
          alignItems: "center",flexDirection:"column",
          justifyContent : "center",
          position: "absolute",
          top : props.isList ? 5 : -5,
          right : props.isList ? 5 :-5
        }}>
          <Text style={{color: "#FFF", textAlign:"center", fontSize: 10,}}>{(props.item.reject === false ? (props.item.done == false ? "En attente" :"Accepté") : "Rejeté").toLowerCase()}</Text>
        </View>
      </TouchableOpacity>
      <View style={[styles.rect8,{
            backgroundColor: tinycolor(global.config.color2).toRgbString()
      }]}></View>
      <Modal
        animationType='slide'
        isNative={true}
        onRequestClose={()=>{
          showModal(false);
        }}
        containerStyle={{ flexDirection: 'row', alignItems: 'flex-end' }}
        backgroundColorTitle={props.item.reject === false ? (props.item.done == false ? "orange" : "green") : "red"}
        visible={modal}
        style={{
          height : 300
        }}
        title={"RDV "+(props.item.reject === false ? (props.item.done == false ? "an attente de validation" :"accepté") : "rejeté").toLowerCase()}
        footer={
          <View
            style={{
              height: 60,
              width : "100%",
              // position:"absolute",
              // bottom: 0,
              // left:0,
              // backgroundColor: global.config.color1,
              backgroundColor : props.item.reject === false ? (props.item.done == false ? "orange" : "green") : "red",
              flexDirection:"row",
              justifyContent: "space-around",
              alignItems : "center"
            }}
          >
            <TouchableOpacity onPress={()=>{
              showModal(false);
              Linking.openURL(`tel://${item.telephone.replace(/\s+/,'').trim()}`);
            }}>
              <MaterialCommunityIconsIcon
                  name="phone"
                  style={styles.iconButton}
                ></MaterialCommunityIconsIcon>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
              showModal(false);
              var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
              var location = `${item?.position?.lat},${item?.position?.lng}`;
              var url = scheme + `${location}?q=${location}&z=16&center=${location}&saddr=&daddr=${location}&directionsmode=transit`;
              Linking.openURL(url);
            }}>
            <MaterialCommunityIconsIcon
              name="directions-fork"
              style={styles.iconButton}
            ></MaterialCommunityIconsIcon>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            showModal(false);
            navigate("Fiche", item);
          }}>
              <MaterialCommunityIconsIcon
                  name="newspaper"
                  style={styles.iconButton}
                ></MaterialCommunityIconsIcon>
            </TouchableOpacity>
          </View>
        }
      >
        {props.item.reject ? [
          <Text key="title">Motif de rejet</Text>,
          <Text key="message" style={{
            margin: 7,
            padding: 7,
            textAlign: "center",
            backgroundColor: "#e4e4e4",
            // color : "#000",
            borderRadius : 5,
            minHeight: 100,
            // maxHeight: 100,
            textAlignVertical : "center",
          }}>
            {props.item.motif}
          </Text>
        ] : (props.item.done == false ? [
          <Text key="title">Votre message</Text>,
          <Text key="message" style={{
            margin: 7,
            padding: 7,
            textAlign: "center",
            backgroundColor: "#e4e4e4",
            // color : "#000",
            borderRadius : 5,
            minHeight: 100,
            // maxHeight: 100,
            textAlignVertical : "center",
          }}>
            {props.item.description}
          </Text>
        ] : [
          <Text key="client" style={[styles.textAccept,{fontSize : 20, paddingBottom: 5}]}>{ props.item.client.nom}</Text>,
          <Text key="title">Date du rendez vous</Text>,
          <Text key="date" style={styles.textAccept}>{ moment(props.item.date).format("DD/MM/YYYY")} ({moment(props.item.date).from(moment())})</Text>,
          <Text key="title-heure">Heure du rendez vous</Text>,
          <Text key="heure" style={styles.textAccept}>{ props.item.heure}</Text>,
          <Text key="title-adresse">Lieu du rendez vous</Text>,
          <Text key="adresse" style={[styles.textAccept, {fontSize: 15}]}>{ props.item.client.adresse}</Text>
        ])}
        <TouchableOpacity style={[
            styles.button,
            {
              backgroundColor: "red"
            }
          ]} onPress={async ()=>{
            showSpinner(true);
            await  API.users.save({
              ...this.state.userToken,
              delete : true
            });
            await this._logout();
          }}>
          </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 85,
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
    width: 64,
    height: 64,
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
    height: 22,
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
    backgroundColor: "transparent",
    alignSelf: "stretch",
    height: 2,
    paddingTop: 0,
    marginTop: 5,
    marginBottom: 0
  },
  iconButton : {
    color: "white",
    fontSize : 30
  },
  textAccept : {
    fontSize : 15,
    textAlign: "center",
    fontWeight:"bold",
    padding: 0,
    paddingTop: 0,
  }
});

export default SearchItemRDV;
