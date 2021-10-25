import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIconsIcon from "react-native-vector-icons/MaterialIcons";
import { BlurView } from 'expo-blur';
import {navigate} from '../../Navigation';
import {Context} from "../context/LocationContext";
import API from "../../API";

var isSelected = (selected, index,key)=>((index == 0 && !selected) || selected == index || selected == key);
var isNotSelected = (selected, index,key)=>!isSelected(selected, index,key);
var getStyle = (selected, index,key)=>(isSelected(selected, index,key) ? {...styles.selected, color: global.config.color1} : styles.icon);
var routes = {
  "search" : "Recherche",
  "today" : "RDV",
  "favorite-border" : "Favoris",
  "face" : "Profil",
}
function BottomMenu(props) {
  const { showSpinner ,alert, favoris,userToken} = React.useContext(Context);

  var _T = (null === (props.blur ?? props.intensity)  || false === (props.blur ?? props.intensity) || 0 === (props.blur ?? props.intensity)) ? View : BlurView;
  return (
    <_T  intensity={props.intensity ?? 90} style={[styles.container, props.style]}>
      {
        Object.keys(routes).map((key,index)=>{
          var _s = isSelected(props.selected, index, key);
          return <TouchableOpacity
          key={"bottomMemuAction"+index} 
          style={ _s ? {display : "none"}: styles.iconSelected} 
          disabled={_s}
          onPress={async ()=>{
            switch (key) {
              case "favorite-border":
                try {
                  showSpinner(true);
                  var query = {
                    filter : {
                      "_id":{"$in": favoris},
                    }
                  };
                  var ret;
                  if(query.filter._id.$in.length){
                    ret = await API.clients.find(query);
                  }
                  if(ret && ret.length){
                    navigate("Liste",{results : ret,query : "Mes Favoris", isTitle: true, filter : query.filter});
                  }else{
                    alert('Informations', "Pas de Favoris",{
                      type : 'warn'
                    });
                  }
                }catch(e){
                  console.error(e);
                }finally{
                  showSpinner(false);
                }     
                break;
              case "today":
                try {
                  showSpinner(true);
                  var query = {
                    filter : {
                      "user._id":userToken._id,
                      "$and" : [
                        {"date" : {"$exists" : true}},
                        {"date" : {"$ne" : ""}},
                      ]
                    }
                  };
                  var ret = await API.reservation.find(query);
                  if(ret && ret.length){
                    navigate("Liste",{
                      results : ret,
                      query : "Rendez-vous", 
                      isTitle: true, 
                      filter : query.filter, 
                      api:"reservation", 
                      type : "RDV"
                    });
                  }else{
                    alert('Informations', "Pas de Rendez-vous",{
                      type : 'warn'
                    });
                  }
                }catch(e){
                  console.error(e);
                }finally{
                  showSpinner(false);
                }
                break;
              default:
                navigate(routes[key]);
                break;
            };
          }}
        >
          <MaterialIconsIcon
            name={key}
            style={[getStyle(props.selected, index, key),{
              ...(props.iconSelected && _s ? {color : props.iconSelected} : {}),
              ...(props.icon && !_s ? {color : props.icon} : {}),
            }]}
          ></MaterialIconsIcon>
        </TouchableOpacity>;
      }
        )
      }
    </_T>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.0)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: 51,
    width: "100%"
  },
  iconSelected: {
    width: 40,
    height: 40,
    flexDirection: "row"
  },
  icon: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 40
  },
  selected: {
    fontSize: 40
  },
  iconNonSelected: {
    width: 40,
    height: 40,
    flexDirection: "row"
  },
  icon5: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 40
  },
  group: {
    width: 40,
    height: 40,
    flexDirection: "row"
  },
  icon3: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 40
  },
  group2: {
    width: 40,
    height: 40,
    flexDirection: "row"
  },
  icon4: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 40
  }
});

export default BottomMenu;
