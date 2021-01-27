const BG = require("../assets/images/register.jpg");
import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  AsyncStorage,
  TouchableOpacity,
  StatusBar,
  BackHandler,
  Dimensions
} from "react-native";
import TextInputRect from "../components/TextInputRect";
import ValidationComponent from 'react-native-form-validator';
import API from "../../API";
import Spinner from 'react-native-loading-spinner-overlay';
import {Context} from "../context/LocationContext";
import { Constants } from "react-native-unimodules";

const styles = StyleSheet.create({
  container: {
    padding: "10%",
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    alignContent : "flex-start",
    flexDirection: "column"
  },
  bgPage:{
    position: "absolute",
    top: 0,
    left : 0,
    bottom : 0 ,
    height : 0,
    width: Dimensions.get("window").width,
    height : Dimensions.get("window").height,
    backgroundColor: "white"
  },
  spacer: {
    flex: 1,
    margin: 0,
    alignSelf: "stretch"
  },
  scrollArea_contentContainerStyle: {
    padding: 3,
    paddingHorizontal : 20,
    backgroundColor : "rgba(255,255,255,0.6)",
    borderRadius: 15,
    // flex: 1,
    height :620,
    marginTop :  0,
    width : "100%",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",

    // justifyContent: "flex-start",
    // alignItems: "center"
  },
  image: {
    width: 128,
    height: 128,
    margin: 10
  },
  textInputRect: {
    left: 0,
    height: 70,
    alignSelf: "stretch"
  },
  textInputRect2: {
    left: 0,
    height: 70,
    alignSelf: "stretch"
  },
  telephoneRect: {
    left: 0,
    justifyContent: "center",
    height: 70,
    alignSelf: "stretch",
    margin: 5
  },
  telephone: {
    fontFamily: "roboto-700",
    color: "#121212",
    height: 20,
    alignSelf: "stretch"
  },
  emailRect: {
    left: 0,
    justifyContent: "center",
    height: 70,
    alignSelf: "stretch",
    margin: 5
  },
  email: {
    fontFamily: "roboto-700",
    color: "#121212",
    height: 20,
    alignSelf: "stretch"
  },
  pwdRect: {
    left: 0,
    justifyContent: "center",
    height: 70,
    alignSelf: "stretch",
    margin: 5
  },
  pwd: {
    fontFamily: "roboto-700",
    color: "#121212",
    height: 20,
    alignSelf: "stretch"
  },
  loginBtn: {
    backgroundColor: "rgba(45,176,221,1)",
    width: "90%",
    height: 40,
    borderRadius: 32,
    margin: 5,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between"
  },
  creerMonCompte: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 16,
    textAlign: "center",
    height: 48,
    paddingTop: 8
  },
  button: {
    flexDirection: "row",
    height: 30,
    width: "50%",
    borderRadius: 8,
    margin: 5
  },
  identification: {
    fontFamily: "roboto-regular",
    color: "rgba(0,0,0,1)",
    height: 30,
    fontSize: 15,
    textAlign: "center",
    flex: 1,
    padding: 6
  }
});

export default class MyForm extends ValidationComponent {
  static contextType = Context;
  constructor(props) {
    super(props);
    // StatusBar.setBarStyle("light-content");
    StatusBar.setBarStyle("dark-content");
    this.state = {
      nom: "",
      prenom: "",
      email: "",
      phone: "",
      password: "",
      spinner : false
    };
    this.navigation = props.navigation;
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      ()=>{
        this.navigation.replace("Login");
        return true;
      }
    );
  }
  componentWillUnmount(){
    this.backHandler.remove();
  }
  async _onSubmit() {
    const { showSpinner,alert , setUserToken} = this.context;
    // Call ValidationComponent validate method
    var valid = this.validate({
      nom: {minlength:2, maxlength:50, required: true},
      prenom: {minlength:2, maxlength:50, required: false},
      email: {email: true, required: true},
      phone: {numbers: true},
      password: {minlength:4, maxlength:50, required: true},
    });
    if(valid){
      try{
      showSpinner(true);
      var res = await API.users.findOne({
        filter :{
          email : this.state.email.trim().toLowerCase()
        },
        fields : ["_id"]
      });
      if(res){
        showSpinner(false);
        alert("Erreur","L'utilsateur <<"+this.state.email+">> existe deja",{ type: "error" });
        return ; 
      }
      API.users.save({
        "type_user": "public",
        nom: this.state.nom.trim().toLowerCase(),
        prenom: this.state.prenom.trim().toLowerCase(),
        email: this.state.email.trim().toLowerCase(),
        phone: this.state.phone.trim().toLowerCase(),
        password: this.state.password.trim().toLowerCase(),
      }).then(async (value)=>{
        if(value){
          console.log(value);
          await setUserToken({
            ...value,
            _id: value._id.trim().toLowerCase(),
            nom: value.nom.trim().toLowerCase(),
            prenom: value.prenom.trim().toLowerCase(),
            email: value.email.trim().toLowerCase(),
            phone: value.phone.trim().toLowerCase(),
            photo : "",
          });
          showSpinner(false);
          this.navigation.replace("Recherche");
        }else{
          showSpinner(false);
          alert("Enregistrement","Enregistrement impossible",{ type: "error" });
        }
        
      },(error)=>{
        showSpinner(false);
        alert("Erreur 0x02","Enregistrement impossible",{ type: "error" });
        console.error("Error",error);
      }); 
    } catch(e){
      alert("Erreur 0x03","Enregistrement impossible",{ type: "error" });
    } finally {
      showSpinner(false);
    }
  }
  }
  render(props) {
    return (
      <View style={styles.container}>
        <Image style={[styles.bgPage]} 
          source={
            // {uri: "https://picsum.photos/200/300?"+Date.now()+Math.random()}
            BG
          }
          resizeMode="cover"
        />
          <Spinner
            visible={this.state.spinner}
            textContent={'Enregistrement...'}
            textStyle={{
              color: "white"
            }}
          />
        <View style={styles.spacer}></View>

          <ScrollView
            horizontal={false}
            contentContainerStyle={[styles.scrollArea_contentContainerStyle]}
          >
            <Image
              source={require("../assets/images/icon2.png")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
            <TextInputRect
              name="nom"
              errors={this.errors}
              self={this}
              nom="Nom" style={styles.textInputRect}></TextInputRect>
            <TextInputRect
              name="prenom"
              errors={this.errors}
              self={this}
              title="Prénom"
              placeholder="Entrez votre prénom"
              style={styles.textInputRect2}
            ></TextInputRect>
            <TextInputRect
              name="phone"
              errors={this.errors}
              self={this}
              title="Téléphone"
              placeholder="Entrez votre No de téléphone"
              keyboardType="phone-pad"
              style={styles.textInputRect2}
            ></TextInputRect>
            <TextInputRect
              name="email"
              errors={this.errors}
              self={this}
              title="Email"
              placeholder="Entrez votre Email"
              keyboardType="email-address"
              style={styles.textInputRect2}
            ></TextInputRect>
            <TextInputRect
              name="password"
              errors={this.errors}
              self={this}
              title="Mot de passe"
              placeholder="Entrez votre mot de passe"
              secureTextEntry={true}
              style={styles.textInputRect2}
            ></TextInputRect>
            <TouchableOpacity onPress={this._onSubmit.bind(this)}  style={styles.loginBtn}>
              <Text style={styles.creerMonCompte}>Créer mon compte</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.navigation.replace("Login")}
              style={styles.button}
            >
              <Text style={styles.identification}>S'Identifier</Text>
            </TouchableOpacity>
          </ScrollView>
        <View style={styles.spacer}></View>

          <View style={{
            backgroundColor : "rgba(255,255,255,0.4)",
            position:"absolute",
            top: 0,
            left:0,
            height:Constants.statusBarHeight,
            width : Dimensions.get("window").width
          }}></View>
      </View>
    );
  }
}
