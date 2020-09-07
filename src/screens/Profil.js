import React, { Component } from "react";
import TopBar from "../components/TopBar";
import Modal from "../components/Modal";
import {Context} from "../context/LocationContext";

import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  AsyncStorage
} from "react-native";
import TextInputRect from "../components/TextInputRect";
import ValidationComponent from 'react-native-form-validator';
import API from "../../API";
import Gravatar from '@krosben/react-native-gravatar';
import { popToTop, replace } from "../../Navigation";
import * as GoogleSignIn from 'expo-google-sign-in';

export default class MyForm extends ValidationComponent {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.rules.phone = /^(\+|00)?\d{1,3}([ \.\-]?\d){6,8}$/;
    this.state = {
      // ...userToken,
      spinner : false,
      showChangePwd :  false,
      showDeleteUser :  false,
      newpwd : "",
      oldpwd : ""
    };
    this.navigation = props.navigation;
  }
  componentWillMount(){
    const { userToken } = this.context;
    this.setState(userToken);
  }
  async _logout(){
    const { showSpinner ,userToken, removeUserToken} = this.context;
    showSpinner(true);
    try{
      switch (userToken.type) {
        case "google":
          await GoogleSignIn.signOutAsync();
          break;
        case "facebook":
          break;
      }
    }catch(e){}
    removeUserToken();
    popToTop(0);
    replace("Login");
    showSpinner(false)
  }
  async _onSubmit(validate, dataToSave) {
    const { showSpinner,alert, userToken,setUserToken } = this.context;

    // Call ValidationComponent validate method
    var valid = this.validate(validate ?? {
      nom: {minlength:2, maxlength:50, required: true},
      prenom: {minlength:2, maxlength:50, required: false},
      phone: {phone: true},
    });
    if(valid){
      showSpinner(true);
      try{
        dataToSave = dataToSave ?? {
          nom: this.state.nom.trim(),
          prenom: this.state.prenom.trim(),
          phone: this.state.phone.trim(),
        };
        var data = {
          ...userToken,
          ...dataToSave
        };
        var value = await API.users.save(data);
        console.log(value);
        await setUserToken({
          ...userToken,
          ...(Object.keys(dataToSave).reduce((a,b)=>{
            a[b] = value[b];
            return a;
          },{}))
        });
        this.setState(dataToSave);
        alert('Informations', "Profil mis à jour avec success",{
          type : 'success'
        });
        showSpinner(false); 
      }catch(e){
        console.error(e);
        alert('Erreur', "Le serveur de repond pas",{
          type : 'error'
        });
      } finally{
        showSpinner(false);
        this.setState({
          showChangePwd :  false,
          showDeleteUser :  false,
        })
      }
    }
  }
  render(props) {
    const { alert, showSpinner , userToken} = this.context;
    return (
      <View style={styles.container}>
        <TopBar
          title="Profil"
          rightIcon2="trash"
          icon="logout"
          logoStyle={{
            display : "none"
          }}
          onPress={this._logout.bind(this)}
        ></TopBar>
        <ScrollView style={{flex:1, width:"100%", alignContent:"center",
          paddingTop: 20,
        }}>
        <View style={styles.image}>
          {
            this.state.photo ? 
            <Image
              source={{uri: this.state.photo }}
              resizeMode="contain"
              style={{
                width: 170,
                height: 170,
                margin: 5,
                borderRadius: 100
              }}
            ></Image> : 
            <Gravatar email={this.state.email} size={400} defaultImage="mm" />
          }
        </View>
        <Text style={styles.userGmailCom}>{this.state.email}</Text>
        <TouchableOpacity style={styles.button} style={styles.button1} onPress={()=>this.setState({showChangePwd: true})}>
          <Text style={styles.modifier}>Modifier Mot de passe</Text>
        </TouchableOpacity>
        <View style={styles.rect}></View>
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
              style={styles.textInputRect}
            ></TextInputRect>
            <TextInputRect
              name="phone"
              errors={this.errors}
              self={this}
              title="Téléphone"
              placeholder="Entrez votre No de téléphone"
              keyboardType="phone-pad"
              style={styles.textInputRect}
            ></TextInputRect>
        <TouchableOpacity  style={styles.button} onPress={this._onSubmit.bind(this)}>
          <Text style={styles.modifier2}>Modifier</Text>
        </TouchableOpacity>
        <View style={styles.rect}></View>
        <Text style={[styles.userGmailCom, {marginTop:20}]}>Je veux supprimer mon compte</Text>
        <TouchableOpacity style={[styles.button1,{
          backgroundColor : "red"
        }]} onPress={()=>this.setState({showDeleteUser: true})}>
          <Text style={styles.modifier2}>Supprimer</Text>
        </TouchableOpacity>
        <View style={styles.rect2}></View>
        </ScrollView>
        <Modal
        animationType='slide'
        isNative={true}
        onRequestClose={()=>{
          this.setState({
            showChangePwd: false,
            newpwd : "",
            oldpwd : ""
          });
        }}
        containerStyle={{ flexDirection: 'row', alignItems: 'flex-end' }}
        visible={this.state.showChangePwd}
        title="Changer Mot de passe"
        backgroundColorTitle={styles.button.backgroundColor}
        style={
          {height: 270}
        }
        >
          <TextInputRect
            name="oldpwd"
            errors={this.errors}
            secureTextEntry={true}
            self={this}
            title="Ancien Mot de passe" style={styles.textInputRect}></TextInputRect>
          <TextInputRect
            name="newpwd"
            errors={this.errors}
            secureTextEntry={true}
            self={this}
            title="Nouveau mot de passe"
            placeholder="Entrez votre prénom"
            style={styles.textInputRect}
          ></TextInputRect>
          <TouchableOpacity  disabled={this.state.oldpwd == "" || this.state.newpwd == ""} style={[
            styles.button,
            this.state.oldpwd == "" || this.state.newpwd == "" ? {
              backgroundColor: "rgba(0,0,0,0.1)"
            } : {}
          ]} onPress={()=>{
            if(this.state.oldpwd != this.state.password)
              return alert("Erreur","Les mots de passe ne correspondent pas.",{type:"warn"});
            this._onSubmit({
              password : {required : true}
            },{
              ...userToken,
              password: this.state.newpwd
            });
          }}>
            <Text style={styles.modifier2}>Modifier</Text>
          </TouchableOpacity>
        </Modal>
      <Modal
        animationType='slide'
        isNative={true}
        onRequestClose={()=>{
          this.setState({showDeleteUser: false});
        }}
        containerStyle={{ flexDirection: 'row', alignItems: 'flex-end' }}
        backgroundColorTitle="red"
        visible={this.state.showDeleteUser}
        style={{
          height : 230,
        }}
        title="Supprimer le compte"
      >
        <Text style={{
          margin: 10,
          padding: 10,
          textAlign: "center",
          backgroundColor: "#ffdd36",
          color : "#ff4545",
          borderRadius : 10,
        }}>
          {"Cette Action est irreversible\n\nUne fois supprimer, votre compte ne poura plus etre restaurer"}
        </Text>
        <TouchableOpacity style={[
            styles.button,
            {
              backgroundColor: "red"
            }
          ]} onPress={async ()=>{
            showSpinner(true);
            await  API.users.save({
              ...userToken,
              delete : true
            });
            await this._logout();
          }}>
            <Text style={styles.modifier2}>Supprimer mon compte</Text>
          </TouchableOpacity>
      </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  spacer1: {
    backgroundColor: "rgba(245,8,8,1)",
    alignSelf: "stretch",
    height: 24
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  userGmailCom: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign : "center"
  },
  button: {
    width: 240,
    height: 40,
    alignSelf:"center",
    backgroundColor: "rgba(45,176,221,1)",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 32,
    marginTop: 10
  },
  modifier: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)"
  },
  rect: {
    backgroundColor: "rgba(0,0,0,0.55)",
    height: 1,
    alignSelf: "stretch",
    margin: 10,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 30
  },
  textInputRect: {
    left: 0,
    height: 70,
    alignSelf: "stretch",
    paddingHorizontal: 30
  },
  button1: {
    width: 240,
    height: 40,
    alignSelf:"center",
    backgroundColor: "rgba(45,176,221,1)",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 32,
    marginTop: 20,
  },
  modifier2: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)"
  },
  rect2: {
    height : 50,
  }
});

