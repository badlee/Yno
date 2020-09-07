import React from "react";
import { StyleSheet, View,Image, Text } from "react-native";
import SvgUri from 'expo-svg-uri';

function Cmp(props) {
  var [loading, setLoading] = React.useState(true);
  return (
    <View style={[styles.container, props.style]}>
      { 
        (props.source.uri && /.svg$/.test(props.source.uri) ? <SvgUri
          {...props}
          width={props.style.width}
          height={props.style.height}
        /> : <Image
          {...props}
          onLoadEnd={()=>{
            setLoading(false);
          }}
        />)
      }
        {/* <Text>{loading}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  ellipse: {
    width: 15,
    height: 15,
    margin: 0,
    alignSelf: "center"
  }
});

export default Cmp;
