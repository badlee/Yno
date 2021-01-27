import React from "react";
import { StyleSheet, View, Text, Image as FastImage } from "react-native";
import SvgUri from 'expo-svg-uri';
// import FastImage from 'react-native-fast-image';

function Cmp(props) {
  var [loading, setLoading] = React.useState(true);
  return props.source.uri && /.svg$/.test(props.source.uri) ? <SvgUri
          {...props}
          width={props.style.width}
          height={props.style.height}
        /> : <FastImage
          resizeMode = "contain"
          {...props}
          width={props.style.width}
          height={props.style.height}
          onLoadEnd={()=>{
            setLoading(false);
          }}
        />;
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    margin: 0,
  },
  ellipse: {
    width: 15,
    height: 15,
    margin: 0,
    alignSelf: "center"
  }
});
function prefetch(url){
  FastImage.prefetch(url);
}

export default Cmp;
export{
  prefetch
};
