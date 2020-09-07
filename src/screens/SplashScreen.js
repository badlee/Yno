import React, { Component,useState } from "react";
import { AsyncStorage, StyleSheet, View, Text, Image , TouchableOpacity, StatusBar, Alert} from "react-native";
import API from "../../API";
import {Context, moment} from "../context/LocationContext";
import { AppLoading } from "expo";
import {replace } from '../../Navigation';
import { Circle } from 'react-native-animated-spinkit'

function SplashScreen() {
  const { alert,userToken} = React.useContext(Context);
  const [error, setError] = React.useState(false);
  const bootstrapAsync = async () => {
    try{
      setError(false);
      let intro = "";
      try {
        intro = await AsyncStorage.getItem('intro') ?? "";
      } catch (e) {}

      var res = await API.categorie_reservation({limit : -1 });
      global.categorie_reservation = res;
      var res = await API.categorie({limit : -1 });
      global.categories = res;
      res = await API.configuration();
      global.config = res;
      res = await API.publicite({
        filter : {
          "expired": {"$gte":moment().format("YYYY-MM-DD")},
          "visibilty" : true,
          "$and" :[
            {"lien" : {"$exists" : true}},
            {"lien" : {"$ne" : ""}},
            {"client" : {"$exists" : true}},
            {"client" : {"$ne" : ""}},
            {"image2x1" : {"$exists" : true}},
            {"image2x1" : {"$ne" : ""}},
          ]
        },
        sort : {
          _modified : -1
        },
        limit : 50,
        fields : ["lien","image2x1"]
      });
      global.publicites = res;
      res = await API.publicite({
        filter : {
          "expired": {"$gte":moment().format("YYYY-MM-DD")},
          "visibilty" : true,
          "$and" :[
            {"lien" : {"$exists" : true}},
            {"lien" : {"$ne" : ""}},
            {"client" : {"$exists" : true}},
            {"client" : {"$ne" : ""}},
            {"description" : {"$exists" : true}},
            {"description" : {"$ne" : ""}},
          ]
        },
        sort : {
          _modified : -1
        },
        limit : 50,
        fields : ["lien","description","client"]
      });
      global.publicitesText = res;
      if(userToken)
        replace("Recherche");
      else
        replace(intro ? "Login" : "Slider");
      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      // splashDone({ token: userToken, goto : intro ? "Login" : "Slider"});
    }catch(e){
      console.error("ERROR",e);
      alert('Erreur', "Le serveur de repond pas",{
        type : 'error'
      });
      setError(true);
    }
  };
  React.useEffect(() => {
    // StatusBar.setBarStyle("light-content");
    StatusBar.setBarStyle("dark-content");
    // Fetch the token from storage then navigate to our appropriate place
    
    bootstrapAsync();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.rect2}></View>
      <View style={styles.rect3}>
        {error ? <TouchableOpacity style={styles.button} onPress={bootstrapAsync}>
          <Text style={styles.retry}>Réessayer</Text>
        </TouchableOpacity>:
        <View style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems : "center"
        }}>
          <Circle color="rgba(241,117,34,1)" size={50}></Circle>
          <Text style={styles.chargement}>Chargement...</Text>
        </View>
        }
      </View>
      <View style={styles.rect4}></View>
      <Image
        source={require("../assets/images/icon2.png")}
        resizeMode="contain"
        style={styles.image}
      ></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  rect2: {
    flex: 1
  },
  rect3: {
    alignSelf: "stretch",
    height: 50,
    alignItems: "center",
    justifyContent: "space-around"
  },
  chargement: {
    fontFamily: "roboto-regular",
    fontSize : 11,
    color: "#444",
    // backgroundColor: "rgba(241,117,34,0.2)",
    paddingVertical: 2,
    paddingHorizontal: 7,
    marginTop : 15,
    borderRadius : 7
  },
  rect4: {
    flex: 1
  },
  image: {
    width: 50,
    height: 50
  },

  button: {
    flexDirection: "row",
    height: 30,
    width: 200,
    borderRadius: 8,
    margin: 10,
    backgroundColor: "orange",
  },
  retry: {
    fontFamily: "roboto-regular",
    color: "rgba(0,0,0,1)",
    height: 30,
    fontSize: 15,
    textAlign: "center",
    flex: 1,
    padding: 6,
    color: "white"
  },
});

export default function (props) {
  const { alert,isReady} = React.useContext(Context);

  return  (isReady == false ? <AppLoading/>: <SplashScreen/>)
};
