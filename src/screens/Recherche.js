import React, { Component } from "react";
import { StyleSheet, View, Image, Text, Keyboard, Dimensions, StatusBar, AsyncStorage, Linking, ScrollView, TouchableOpacity, Alert } from "react-native";
import SearchInput from "../components/SearchInput";
import BottomMenu from "../components/BottomMenu";
import {Context,moment} from "../context/LocationContext";
import Spinner from 'react-native-loading-spinner-overlay';
import API from "../../API";
import { Constants } from "react-native-unimodules";
import {navigate } from '../../Navigation';

var pubHeight = (Dimensions.get("window").width - 40) / 2;

function Recherche(props) {
  const [_bgIsSet, setBackground] = React.useState(false);
  const { history,myLocationPlace,spinner, alert, userToken } = React.useContext(Context);
  const [bottomMenu,showBottomMenu] = React.useState(true);
  var pub;
  React.useEffect(()=>{
      StatusBar.setBarStyle("light-content");
  },[])
  try{
    if(!_bgIsSet && global?.config)
      setBackground(API.getAssetUri(global.config.background[ Math.floor(global.config.background.length*Math.random()+1) - 1].path));
  }catch(e){
  }
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        showBottomMenu(false); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        showBottomMenu(true); // or some other action
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return (
    <View style={styles.container} onPress={()=>{console.log(global)}}>
      <Image style={[styles.bgPage]} 
        source={{uri:_bgIsSet || "https://picsum.photos/id/160/3200/2119.jpg"}}
        resizeMode="cover"
      />
      {_bgIsSet  && <View style={[styles.bgPage]} />}
      <Spinner
        visible={spinner}
        // textContent={'Recherche...'}
        textStyle={{
          color: "white", 
        }}
      />
      {!!userToken && bottomMenu && [<View key="user-separator"  style={[styles.spacer]}></View>,
      <Text key="user-title"  style={{
        textAlign :"left",
        alignSelf:"flex-start",
        paddingHorizontal : 30,
        marginTop : 10 + Constants.statusBarHeight ,
        color : "white",
        // fontWeight : 700,
        fontFamily : 'roboto-700',
        fontSize : 30
      }}
      numberOfLines={1}
      >{ moment().greeting()} {(userToken.prenom || userToken.nom).split(/\s+/)[0]}{(userToken.prenom || userToken.nom).length < 3 && userToken.prenom && userToken.nom  ? (" "+ (userToken.nom).split(/\s+/)[0]) : ""}</Text>]}
      
      <Image
        source={require("../assets/images/icon2.png")}
        resizeMode="contain"
        style={styles.image1}
      />
      {
        myLocationPlace &&
            <Text style={[styles.brazaville,{
              position: "relative",
              top : -30,
              flex: 0,
              color: "rgba(241,117,34,1)",
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: {width: 0, height: 0},
              textShadowRadius: 10,
            }]}>  {myLocationPlace.city}  </Text>
      }
      <SearchInput style={styles.searchInput}></SearchInput>
      <View style={styles.spacer}></View>
      {!(!!bottomMenu && !!((global.publicites && global.publicites.length )|| (history && history.length ))) &&
        <View style={[styles.spacer,{
          height:pubHeight + 20
        }]}></View>
      }
      {!!bottomMenu && !!((global.publicites && global.publicites.length )|| (history && history.length )) && <View style={{
        flexDirection:"row"
      }}>
        {!!(history && history.length) && [<Text key="history-title" style={{
          transform: [{ rotate: "-90deg" }] ,
          margin: 0,
          padding : 0,
          width : pubHeight,
          height : 20,
          overflow : "hidden",
          position : "absolute",
          backgroundColor : "rgba(241,117,34,1)",
          color: "white",
          left: -(pubHeight / 2) + 15,
          top : pubHeight / 2 - 10,
          alignSelf:"center",
          textAlign : "center",
          justifyContent:"center",
          fontFamily: "roboto-regular",
          borderRadius: 20,
          fontSize : 12,
        }}>Mon Historique</Text>,
        <View key="history-separator" style={{
          width : 30
        }}></View>]}
        <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={200}
              pagingEnabled={false}
              centerContent={true}
              decelerationRate="fast"
              // pagingEnabled
              style={{
                // height : 128,
                width : "100%",
                margin : 0,
                padding: 0,
                paddingRight: 20,
                paddingLeft: (history && history.length) ? 0 : 20,
            }}
            >
          {
            (history.length > 0 ? history : [null]).map((item, index)=>{
              var _pub = Math.floor((global?.publicites ?? 0).length*Math.random()+1) - 1;
              if((global?.publicites ?? 0).length > 1 && _pub == pub)
                while (_pub == pub) {
                  _pub = Math.floor((global?.publicites ?? 0).length*Math.random()+1) - 1;
                }
                pub = _pub;
              return  [item && <TouchableOpacity key={item._id} style={{
              width : pubHeight,
              height: pubHeight,
              backgroundColor: "white",
              marginRight: 20,
              alignSelf:"center",
              borderRadius: 10,
              padding : 0,
              overflow: "hidden"
            }} onPress={()=>{
              item.$icon = false;
              navigate("Fiche",item);
            }}>
            <Image
                source={!!(item?.image?.path) ? {uri:API.getAssetUri(item.image.path)} : require("../assets/images/defaultEntrepriseImage.png")}
                resizeMode="cover"
                style={{
                    width: "100%",
                    height: "100%",
                    alignSelf: "stretch"
                }}
              ></Image>
              <Image
                source={!!(item?.logo?.path) ? {uri:API.getAssetUri(item.logo.path)} : require("../assets/images/icon2.png")}
                resizeMode="cover"
                style={{
                    width: (pubHeight - 50)/1.5,
                    height: (pubHeight - 50)/1.5,
                    alignSelf: "stretch",
                    position : "absolute",
                    left : (pubHeight / 2) - ((pubHeight - 50)/1.5)/2,
                    top : ((pubHeight - 50)/1.5)/4,
                    backgroundColor : "rgba(255,255,255,0.4)",
                    borderRadius : 15,
                    padding: 15,
              }}
              ></Image>
              <View style={{
                position : "absolute",
                bottom : 0,
                backgroundColor : "rgba(0,0,0,0.4)",
                height : 50,
                width : "100%",
                alignSelf :"center",
                justifyContent: "center",
              }}>
              <Text style={{
                alignSelf: "center",
                color : "white",
                textAlign:"center",
                fontSize : 13
              }}
              numberOfLines={2}
              >{item.nom}</Text>
              
              {item?.categorie?.nom && <Text style={{
                alignSelf: "center",
                color : "white",
                fontSize: 9
              }}
              numberOfLines={1}
              >{item?.categorie?.nom ?? ""}</Text>}            
              </View>
          </TouchableOpacity>,
            !!(global.publicites && global.publicites.length && (index < 1 || item == null)) &&  <TouchableOpacity key={index+"-pub"} style={{
            height : pubHeight,
            width : pubHeight * 2,
            backgroundColor: "grey",
            alignSelf:"center",
            marginRight: 20,
            borderRadius: 10,
            padding : 0,
            overflow: "hidden"
          }} onPress={()=>{
            Linking.openURL(global.publicites[pub].lien);
          }}>
            <Image
              source={{uri:API.getAssetUri(global.publicites[pub].image2x1.path)}}
              resizeMode="cover"
              style={{
                  width: "100%",
                  height: "100%",
                  alignSelf: "stretch"
              }}
            ></Image>
              <Text style={{
                position: "absolute",
                top : 5,
                left: 5,
                color : "white",
                backgroundColor : "#e05b49",
                padding : 3,
                fontSize : 9,
                fontFamily: "roboto-regular",
                borderRadius : 5

              }}>Publicité</Text>
            </TouchableOpacity>];
          })
          }
          </ScrollView>
        </View>
      }
      {/* <View style={styles.spacer}></View> */}
      {bottomMenu && <View style={[styles.spacer,{
        height: Constants.statusBarHeight * 4
      }]}></View>}

      {bottomMenu && <BottomMenu/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bgPage:{
    position: "absolute",
    top: 0,
    left : 0,
    bottom : 0 ,
    height : 0,
    width: "100%",
    height : "100%",
    backgroundColor: "rgba(0,0,0,0.6)"
  },
  image1: {
    width: 128,
    height: 128,
    margin: 5,
  },
  searchInput: {
    alignSelf: "stretch",
  },
  rect3: {
    height: 20,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    margin: 0,
    marginRight: 15,
    marginLeft: 15,
    marginTop: 5,
  },
  icon: {
    color: "rgba(255,255,255,1)",
    fontSize: 16,
    padding: 0,
    paddingRight: 5
  },
  brazaville: {
    fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    height: 20,
    flex: 1
  },
  // spacer: {
  //   flex: 1,
  //   backgroundColor: "rgba(221, 221, 221,1)"
  // },
  button: {
    height: 200,
    borderRadius: 20,
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    alignSelf: "stretch",
    margin: 15,
    borderColor: "rgba(241,117,34,1)"
  },
  rect11: {
    backgroundColor: "rgba(241,117,34,1)",
    alignSelf: "stretch",
    height: 32,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    height: 26,
    width: 233,
    textAlign: "center",
    fontSize: 19
  },
  mapView: {
    flex: 1,
    alignSelf: "stretch"
  },
  button2: {
    height: 100,
    borderRadius: 16,
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    alignSelf: "stretch",
    margin: 15,
    borderColor: "rgba(241,117,34,1)"
  },
  rect10: {
    backgroundColor: "rgba(241,117,34,1)",
    alignSelf: "stretch",
    height: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  publicite: {
    fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    height: 15,
    width: 233,
    textAlign: "center",
    fontSize: 12
  },
  image2: {
    width: 328,
    height: 79,
    alignSelf: "stretch",
    backgroundColor: "rgba(255,255,255,1)",
    flex: 1
  },
  spacer: {
    alignSelf: "stretch",
    flexDirection: "row",
    flex: 1
  }
});

export default Recherche;
