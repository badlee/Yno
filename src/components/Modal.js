import React, { Component } from "react";
import { StyleSheet,ScrollView, View, Dimensions, Text } from "react-native";
import Modal from "react-native-modal-wrapper";

var blue = "rgba(45,176,221,1)";
var orange = "rgba(241,117,34,1)";

function Cmp(props) {
  return (
<Modal
      overlayStyle = {{opacity: 0.2,...(props.overlayStyle? props.overlayStyle : {})}}
        animationType={props.animationType ?? 'slide'}
        isNative={true}
        onRequestClose={props.onRequestClose}
        containerStyle={[{ flexDirection: 'row', alignItems: 'flex-end' },props.containerStyle]}
        visible={props.visible}
        style={[styles.container,props.style]}
      >
        { !!props.title && <View style={{
          backgroundColor: props.backgroundColorTitle ?? orange,
          alignSelf:"stretch",
          justifyContent: "center",
          borderTopLeftRadius : 20,
          borderTopRightRadius : 20,
          height: 40,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight:"bold",
            alignSelf:"stretch",
            textAlign: "center",
            color: props.colorTitle ?? "#FFFFFF"
          }}
            adjustsFontSizeToFit={true}
            numberOfLines={1}
          >{props.title}</Text>
        </View>}
        <ScrollView style={{
          alignSelf:"stretch",
          // justifyContent: "flex-start",
          flex : 1,
          // padding: 10,
          // paddingBottom : 20,
          borderColor : props.backgroundColorTitle ?? orange,
          borderWidth : 2,
          borderBottomWidth : 0,
        }}><View style={{
          padding: 10,
          paddingBottom : 20,
        }}>
          {props.children}
          </View>
        </ScrollView>
        {props?.footer}
      </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
      width: Dimensions.get("window").width - 20,
      height: 350,
      maxHeight: Dimensions.get("window").height / 2,
      marginHorizontal: 24,
      padding: 0,
      borderTopLeftRadius : 20,
      borderTopRightRadius : 20,
      flexDirection: "column",
      alignItems:"flex-start",
      alignContent:"flex-start",
      justifyContent:"flex-start",
      flex: 1,
  },
  ellipse: {
    width: 15,
    height: 15,
    margin: 0,
    alignSelf: "center"
  }
});

export default Cmp;
