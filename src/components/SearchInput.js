import React, { Component } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";
import {Context} from "../context/LocationContext";
import API from "../../API";
import {navigate } from '../../Navigation';
import SvgUri from 'expo-svg-uri';
import { Circle } from 'react-native-animated-spinkit';
import Image from './Image';

async function _search(setQuery,alert,showSpinner,query,categorie, ignoreQuery=false){
    if((!query || query.length < 3) && ignoreQuery == false) return;
    try {
      showSpinner(true);
      var filter = categorie ? {
        "categorie._id":categorie._id,
        $or:[
          {"nom":{"$text" : query.toLowerCase().trim()}},
          {"description":{"$text" : query.toLowerCase().trim()}},
        ]
      } : {
        $or:[
          {"nom":{"$text" : query.toLowerCase().trim()}},
          {"description":{"$text" : query.toLowerCase().trim()}},
          {"categorie.display":{"$text" : query.toLowerCase().trim()}},
        ]
      };
      var ret = await API.clients.find({
        filter,
        limit : 20
      });
      if(ret && ret.length > (ignoreQuery ? 0 : 1)){
        setQuery("");
        navigate("Liste",{results : ret,query : ignoreQuery && query.toLowerCase().trim() == "" ? categorie.nom : query.toLowerCase().trim(), filter, isTitle : ignoreQuery && query.toLowerCase().trim() == "" });
      }else if(ret && ret.length == 1){
        ret[0].$icon = false; 
        setQuery("");
        navigate("Fiche",ret[0]);
      }else{
        alert('Informations', "Pas de resultats",{
          type : 'info'
        });
        // Alert.alert(undefined,"Pas de resultats");
      }
    } catch (error) {
      console.log("ret ==>ERROR ",error);
      
      alert('Erreur', "Le serveur de repond pas",{
        type : 'error'
      });
    } finally{
      try{
        showSpinner(false);
      }catch(e){}
    }
}
function SearchInput(props) {
  const [query, setQuery] = React.useState("");
  const { showSpinner ,alert} = React.useContext(Context);
  return (
    <View style={[styles.searchBox, props.style]}>
      <View style={[styles.container, props.styleSearchBox]}>
        <TextInput onFocus={props.onFocus} onBlur={props.onBlur} placeholder="Que cherchez vous ?" placeholderTextColor="rgba(0,0,0,0.5)" style={styles.textInput} value={query} onChangeText={(value)=>setQuery(value)}></TextInput>
        <TouchableOpacity disabled={!query || query.length < 3} style={[styles.button,{backgroundColor: global.config.color1,}]} onPress={()=>_search(setQuery,alert,showSpinner,query)}>
          <Icon name="search" style={styles.icon}></Icon>
        </TouchableOpacity>
      </View>

      <View style={[styles.container,{
        height: 130,
        width: "100%",
        marginTop : 20,
        flexDirection : "column",
        backgroundColor : "transparent",
        borderWidth : 0,
        padding : 0,
        margin : 0,
        marginRight: 0,
        marginLeft: 0
      }]}>
        {global.config && <Text style={{
          marginBottom: 0,
          color: "white",
          fontWeight: "bold",

        }}>{global.config.recherche_categorie}</Text>}
        
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={200}
          decelerationRate="fast"
          // pagingEnabled
          style={{
            height : 60,
            width : "100%",
            margin : 0,
            padding: 0,
            paddingHorizontal: 5,
          }}
        >
          {global.config && global.categories.filter(categorie=>!!categorie?.icon?.path).map((categorie,i)=>{
          return <View  key={"cat"+i} style={{
            flexDirection:"column",
            alignItems:"center", 
            margin : 7, 
            justifyContent: "center", 
            backgroundColor: "rgba(255,255,255,1)",
            height: 65,
            width: 65,
            padding : 5,
            borderRadius: 15,
          }}>
            <TouchableOpacity style={{
              flexDirection: "column",
              alignContent: "center",
              alignItems:"center",
            }}
            onPress={()=>_search(setQuery,alert,showSpinner,"", categorie, true)}
            >
              {/.svg$/.test(categorie.icon.path) ?
                <SvgUri
                  width={styles.iconCategorie.width}
                  height={styles.iconCategorie.height}
                  // fill={styles.infoText.color}
                  source={{uri:API.getAssetUri(categorie.icon.path)}}
                /> : 
                <Image
                  loadingIndicatorSource={<Circle />}
                  source={{uri:API.getAssetUri(categorie.icon.path)}}
                  resizeMode="contain"
                  style={[styles.image,styles.iconCategorie]}
                />
              }
              <View style={{height: 3, width: 3, padding:0, margin: 0}}></View>
              <Text style={[styles.infoText,{
                textAlign: "center",
              }]} numberOfLines={2}>
                {categorie?.nom ?? ""}
              </Text>
            </TouchableOpacity>
            </View>
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "column",
    padding : 0,
    margin : 0
  },
  container: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 32,
    borderWidth: 0,
    borderColor: "rgba(45,176,221,1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: 15,
  },
  textInput: {
    fontFamily: "roboto-regular",
    color: "#121212",
    flex: 1,
    alignSelf: "stretch",
    paddingRight: 0,
    fontSize: 15,
    textAlign: "left",
    paddingLeft: 15,
    padding: 0,
    width: "100%",
    height: 40,
    // backgroundColor : "red"
  },
  button: {
    width: 40,
    height: 40,    
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    color: "rgba(255,255,255,1)",
    fontSize: 30
  },
  // categorie : {
  //   // paddingTop: 2,
  //   paddingHorizontal: 10,
  //   position: "relative",
  //   top: -250,
  //   // left: "10%",
  //   width : "80%",
  //   marginHorizontal: "10%",
  //   margin: 0,
  //   height: 30,
  //   // backgroundColor: "rgba(45, 176, 221, 0.8);",
  //   backgroundColor: "rgba(255, 255, 255, 0.6);",
  //   padding: 5,
  //   borderRadius: 10,
  //   borderTopLeftRadius: 0,
  //   borderTopRightRadius: 0,
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   alignContent: "center",
  //   flexDirection: "row",
  // },
  
  infoText :{
    color: "#000000",
    fontSize: 10
  },
  iconCategorie : {
    width: 24,
    height: 24
  },
});

export default SearchInput;
