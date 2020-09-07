import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import SearchBar from "../components/SearchBar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SearchItem from "../components/SearchItem";
import SearchItemRDV from "../components/SearchItemRDV";
import BottomMenu from "../components/BottomMenu";
import {navigate, pop } from '../../Navigation';
import Schedule from '../components/Schedule';
import TopBar from "../components/TopBar";
import {moment} from "../context/LocationContext";
import API from "../../API";

function Liste(props) {
  var $p = props.route.params;
  var _T = ($p.type ?? "") == "RDV" ? SearchItemRDV : SearchItem;
  var [view, setView] = React.useState(($p.type ?? "") == "RDV" ? "view-agenda" : null);
  return (
    <View style={styles.container}>
        {/* <View style={styles.spacer2}></View> */}
        {!!(view != null) ?  [
          <TopBar
            key="title-pbar" 
            title="Mes rendez-vous"
            icon={view}
            onPress={()=>{
              setView(view =="view-list" ? "view-agenda" : "view-list");
            }}
            hasIcon={view != null}
            noLogo={true}
          />,
          (view == "view-agenda" ? <Schedule
            dataArray={$p.results}
          /> : <ScrollView
          key="searchResult"
          horizontal={false}
          contentContainerStyle={styles.scrollArea_contentContainerStyle}
        >
          {
            $p.results.map((item,index)=>{
              item.$icon = true;
              return <_T
                key={"result-"+index}
                item={item}
                isList = {true}
              />
            })
          }
        </ScrollView>)] : [<SearchBar
          key="searchBar"
          text={$p.query || "Recherche"}
          style={styles.materialSearchBarWithBackground}
          inputStyle={$p.isTitle ?? false ? styles.title : {}}
        ></SearchBar>,
          <ScrollView
            key="searchResult"
            horizontal={false}
            contentContainerStyle={styles.scrollArea_contentContainerStyle}
          >
            {
              $p.results.map((item,index)=>{
                item.$icon = true;
                return <_T
                  key={"result-"+index}
                  item={item}
                />
              })
            }
          </ScrollView>]}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  spacer2: {
    backgroundColor: "rgba(245,8,8,1)",
    alignSelf: "stretch",
    height: 24
  },
  localisation: {
    width: 360,
    height: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 15,
    paddingLeft: 15,
    backgroundColor: "rgba(45,176,221,1)"
  },
  icon2: {
    color: "rgba(255,255,255,1)",
    fontSize: 10
  },
  brazaville2: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    flex: 1,
    fontSize: 8
  },
  bottomSpacer: {
    alignSelf: "stretch",
    height: 14,
    backgroundColor: "rgba(45,176,221,1)",
    flexDirection: "row",
    alignItems: "center"
  },
  resultats: {
    fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    fontSize: 8,
    flex: 1,
    textAlign: "center"
  },
  scrollArea: {
    flex: 1,
    alignSelf: "stretch"
  },
  scrollArea_contentContainerStyle: {
    // height: 1030,
    alignSelf: "stretch",
    alignItems: "center",
    paddingBottom: 51
  },
  bottomMenu1: {
    position: "absolute",
    left: 0,
    height: 51,
    width: 360,
    bottom: 0
  },
  title : {
    fontWeight : "bold",
    fontSize : 23
  }
});

export default Liste;
