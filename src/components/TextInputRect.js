import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput as Input } from "react-native";
import { TextInput, DefaultTheme } from 'react-native-paper';
function TextInputRect(props) {
  var error = props.error || (props.name && props.errors && Array.isArray(props.errors) && (props.errors.find(el => el["fieldName"] == props.name) || {})["messages"]);
  return (
    <View style={[styles.container,,{
      height : error ? 75 : 70
    }, props.style]}>
      {/* <Text style={styles.nom}>{props.title || "Nom"}</Text> */}
      <TextInput
        label={props.title || "Nom"}
        // dense={true}
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: global.config.color1,
            // accent: "rgba(45,176,221,1)",
          },
        }}
        editable={props.readOnly == true ? false :  props.editable ?? true}
        disabled={!(props.readOnly == true ? false :  props.editable ?? true)}
        placeholder={props.placeholder || props.title || "Entrez votre nom"}
        dataDetector={props.dataDetector || "address"}
        keyboardType={props.keyboardType || "default"}
        secureTextEntry={props.secureTextEntry ? true :  false }
        style={styles.nomInput}
        mode={props.outline == true ? 'outlined': 'flat'}
        onChangeText={props.name && props.self  && props.self.setState ? (val) => props.self.setState.call(props.self,{[props.name]:val}) : undefined} 
        value={props.name && props.self && props.self.state ? props.self.state[props.name] : props.value}
      ></TextInput>
      { error ? [<Text key="error-text" style={[styles.error,props.errorStyle]}> {Array.isArray(error) ? error[0] : error } </Text>] : [] }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    margin: 0
  },
  nom: {
    fontFamily: "roboto-700",
    color: "#121212",
    height: 20,
    alignSelf: "stretch"
  },
  nomInput: {
    // fontFamily: "roboto-regular",
    // color: "#121212",
    // alignSelf: "stretch",
    // borderWidth: 2,
    // borderColor: global.config.color1,
    // height: 40,
    // borderRadius: 20,
    // paddingHorizontal: 20,
    backgroundColor: "transparent",
    marginVertical: 10,

  },
  error : {
    position: "relative",
    top : -10,
    color : "red",
      fontSize: 10
  }
});

export default TextInputRect;
