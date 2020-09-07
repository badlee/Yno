import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Alert,
  TouchableOpacity,
  StatusBar,
  AsyncStorage
} from "react-native";
import TextInputRect from "../components/TextInputRect";
import ValidationComponent from 'react-native-form-validator';
import API from "../../API";
import Spinner from 'react-native-loading-spinner-overlay';
import {Context} from "../context/LocationContext";

import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import { popToTop, replace } from "../../Navigation";

export default class MyForm extends ValidationComponent {
  static contextType = Context;
  constructor(props) {
    super(props);
  // StatusBar.setBarStyle("light-content");
  StatusBar.setBarStyle("dark-content");
    this.state = {
      email: "",
      password: "",
      spinner : false
    };
    this.navigation = props.navigation;
  }
  async _recherche(){

    this.navigation.replace("Recherche");
    // replace("Recherche");
  }
 
  async _login(value){
    console.log("API.users.findOne",value);
    const { showSpinner,alert , setUserToken} = this.context;
    if(value){
      await setUserToken({
        ...value,
        _id: value._id.trim().toLowerCase(),
        nom: value.nom.trim().toLowerCase(),
        prenom: value.prenom.trim().toLowerCase(),
        email: value.email.trim().toLowerCase(),
        phone: value.phone.trim().toLowerCase(),
        photo : value.photo ?? "",
      });
      this._recherche();
    }else {
      showSpinner(false);
      alert("Identification","Identification impossible",{
        type: 'warn'
      })
    }
  }
  async _onSubmit() {
    const { showSpinner,alert } = this.context;
    console.log(showSpinner,alert);
    // Call ValidationComponent validate method
    var valid = this.validate({
      email: {email: true, required: true},
      password: {minlength:4, maxlength:50, required: true},
    });
    if(valid){
      showSpinner(true);
      try{
        await API.users.findOne({
          filter : {
            email: this.state.email.trim().toLowerCase(),
            password: this.state.password.trim().toLowerCase(),
          }
        }).then(this._login.bind(this),(error)=>{
          showSpinner(false);
          alert("Erreur","Erreur serveur",{
            type: 'error'
          })
          console.error("Error",error);
        });
      }catch(e){
        console.error("Error",e);
      }finally{
        showSpinner(false);
      } 
    }
  }
  render(props) {
    const { showSpinner,alert } = this.context;
    return (
      <View style={styles.container}>
        <Spinner
            visible={this.state.spinner}
            textContent={'Identification...'}
            textStyle={{
              color: "white"
            }}
          />
        <View style={styles.spacer}></View>
        <Image
          source={require("../assets/images/icon2.png")}
          resizeMode="contain"
          style={styles.image}
        ></Image>
        <View style={styles.emailRect}>
        <TextInputRect
              name="email"
              errors={this.errors}
              self={this}
              title="Email"
              placeholder="Entrez votre Email"
              keyboardType="email-address"
            ></TextInputRect>
            <TextInputRect
              name="password"
              errors={this.errors}
              self={this}
              title="Mot de passe"
              placeholder="Entrez votre mot de passe"
              secureTextEntry={true}
            ></TextInputRect>
            
        </View>
        <TouchableOpacity
          onPress={this._onSubmit.bind(this)}
          style={styles.button2}
        >
          <Text style={styles.idendification}>Idendification</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {this.navigation.replace("Register");}}
          style={styles.button}
        >
          <Text style={styles.creerUnCompte}>Créer un compte</Text>
        </TouchableOpacity>
        <View style={styles.rect5}>
          <Text style={styles.sidentifierAvec}>S&#39;identifier avec</Text>
        </View>
        <View style={styles.rect4}>
          <TouchableOpacity onPress={async () =>{
              showSpinner(true);
              try {
                await Facebook.initializeAsync('177760745567844');
                const {
                  type,
                  token,
                  expires,
                  permissions,
                  declinedPermissions,
                } = await Facebook.logInWithReadPermissionsAsync({
                  permissions: ['public_profile','email'],
                });
                if (type === 'success') {
                  // Get the user's name using Facebook's Graph API
                  const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                  Alert.alert('Logged in!', `Hi ${(await response.text())}!`);
                } else {
                  // type === 'cancel'
                }
              } catch ({ message }) {
                Alert.alert(`Facebook Login Error: ${message}`);
              }finally{
                showSpinner(false);
              }
            }}>
            <Image
              source={require("../assets/images/facebook.png")}
              resizeMode="stretch"
              style={styles.image2}
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={async ()=>{
              showSpinner(true);
              try {
                await GoogleSignIn.askForPlayServicesAsync();
                const { type, user } = await GoogleSignIn.signInAsync();
                if (type === 'success') {
                  // find if google user exists
                  var value = await API.users.findOne({
                    filter : {
                    "type_user": "google",
                    "@id" : "googleId-"+user.uid
                    }
                  });
                  if(value)
                    this._login(value);
                  else{
                    var res = await API.user.findOne({
                      filter :{
                        email : user.email
                      },
                      fields : ["_id"]
                    });
                    if(res){
                      showSpinner(false);
                      alert("Erreur","L'utilsateur <<"+user.email+">> existe deja",{ type: "error" });
                      return ; 
                    }
                    // register the user
                    await API.users.save({
                      "type_user": "google",
                      "@id" : "googleId-"+user.uid,
                      displayName : user.displayName,
                      nom: user.lastName,
                      prenom: user.firstName,
                      email: user.email,
                      photo : user.photoURL,
                      phone: "",
                    }).then(async (value)=>{
                      await this._login(value);
                    },(error)=>{
                      showSpinner(false);
                      alert("Erreur","Erreur serveur",{
                        type: 'error'
                      })
                      Alert.alert("Error" ,""+ error);
                      console.error("Error",error);
                    });
                  }

                }
              } catch ({ message }) {
                Alert.alert('login Error' , message);
              } finally{
                showSpinner(false);
              }
          }}>
          <Image
            source={require("../assets/images/google.png")}
            resizeMode="contain"
            style={styles.image3}
          ></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.rect}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: "10%",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between"
  },
  spacer: {
    flex: 1,
    margin: 0,
    alignSelf: "stretch"
  },
  image: {
    width: 200,
    height: 200,
    margin: 10
  },
  emailRect: {
    left: 0,
    justifyContent: "center",
    height: 70,
    alignSelf: "stretch",
    margin: 10,
    marginBottom: 40
  },
  email: {
    fontFamily: "roboto-700",
    color: "#121212",
    height: 20,
    alignSelf: "stretch"
  },
  emailText: {
    fontFamily: "roboto-regular",
    color: "#121212",
    alignSelf: "stretch",
    borderWidth: 2,
    borderColor: "rgba(241,117,34,1)",
    height: 40,
    borderRadius: 20,
    paddingLeft: 5
  },
  pwdRect: {
    left: 0,
    justifyContent: "center",
    height: 70,
    alignSelf: "stretch",
    margin: 10
  },
  pwd: {
    fontFamily: "roboto-700",
    color: "#121212",
    height: 20,
    alignSelf: "stretch"
  },
  pwdText: {
    fontFamily: "roboto-regular",
    color: "#121212",
    alignSelf: "stretch",
    borderWidth: 2,
    borderColor: "rgba(241,117,34,1)",
    height: 40,
    padding: 5,
    borderRadius: 20
  },
  button2: {
    backgroundColor: "rgba(45,176,221,1)",
    height: 40,
    width: 300,
    borderRadius: 32,
    margin: 10,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between"
  },
  idendification: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    textAlign: "center",
    height: 48,
    paddingTop: 8
  },
  button: {
    flexDirection: "row",
    height: 30,
    width: 300,
    borderRadius: 8,
    margin: 10
  },
  creerUnCompte: {
    fontFamily: "roboto-regular",
    color: "rgba(0,0,0,1)",
    height: 30,
    fontSize: 15,
    textAlign: "center",
    flex: 1,
    padding: 6
  },
  rect5: {
    paddingVertical: 20,
    margin: 0,
    alignSelf: "center",
    height: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  sidentifierAvec: {
    fontFamily: "roboto-700",
    color: "#121212"
  },
  rect4: {
    height: 70,
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    margin: 10
  },
  image2: {
    width: 50,
    height: 50,
    padding: 10
  },
  image3: {
    width: 50,
    height: 50,
    padding: 10
  },
  rect: {
    backgroundColor: "#E6E6E6",
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
    alignSelf: "stretch",
    height: 0,
    width: 0,
    opacity: 0
  }
});