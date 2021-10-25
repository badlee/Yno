import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  Share,
  Picker,
  Button,
  Platform,
  ViewBase
} from "react-native";
import Modal from "../components/Modal";
import TopBar from "../components/TopBar";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import ListInfoLine from "../components/ListInfoLine";
import API from "../../API";
import HTML from 'react-native-render-html';
import { FloatingAction } from "react-native-floating-action";
import * as Linking from 'expo-linking';
import { Constants } from "react-native-unimodules";
import {Context,displayMeter,getDistanceFromLatLonInKm, moment} from "../context/LocationContext";
import DateTimePicker from '@react-native-community/datetimepicker';
import DatepickerRange from 'react-native-range-datepicker';
import { Circle } from 'react-native-animated-spinkit';
import { Rating } from 'react-native-ratings';
import tinycolor from 'tinycolor2';
import Image,{prefetch} from '../components/Image';
import { SliderBox } from "react-native-image-slider-box";
const RATING_IMAGE = require('../assets/images/start.png');

function Fiche(props) {
  var item = props.route.params;
  var categorie_reservation = item.categorieRdv && item.categorieRdv.length ? item.categorieRdv : global.categorie_reservation;
  const [note, setNote] = React.useState(null);
  const [motif, setMotif] = React.useState("");
  const [pub, setPub] = React.useState("");
  const [rating, setRating] = React.useState(0);
  const [pickerOpacity, setPickerOpacity] = React.useState(0);
  const [opacityOfOtherItems, setOpacityOfOtherItems] = React.useState(0);
  const [avis, setAvis] = React.useState(null);
  const [raison, setRaison] = React.useState(0);
  const [date, setDate] = React.useState(moment().add(2,"days").toDate());
  var [modalRatingVisible, showRatingModal] = React.useState(false);
  var [modalVisible, showModal] = React.useState(false);
  var [buttonVisible, showButton] = React.useState(false);
  var [dateVisible, showDate] = React.useState(categorie_reservation[0].date);
  var [pickerVisible, showPicker] = React.useState(false);
  const { myLocation, isGpsLocation ,showSpinner, alert, addHistory, favoris, setAsFavori, userToken} = React.useContext(Context);
  var distance = isGpsLocation && item?.position?.lat && item?.position?.lng ? displayMeter(getDistanceFromLatLonInKm(
    item?.position?.lat, item?.position?.lng,
    myLocation.coords.latitude,
    myLocation.coords.longitude,
  )) : "";
  var isFavoris = (()=>{
    var t = favoris.findIndex(id=>item._id == id) ;
    return t != -1;
  })();
  React.useEffect(()=>{
    if(item?.image?.path)
      prefetch(API.getAssetUri(item.image.path));
    if(item?.gallery && item?.gallery?.length)
    item.gallery.forEach(image=>prefetch(API.getAssetUri(image.path)))
    var _pub = Math.floor((global?.publicitesText ?? 0).length*Math.random()+1) - 1;
    setPub((global?.publicitesText ?? [])[_pub] ?? "");
    var v = Platform.OS == "ios";
    showButton(v);
    setPickerOpacity(v ? 0 : 1);
    setOpacityOfOtherItems(v ? 1 : 0);
    addHistory(item);
    API.avis.findOne({
      populate : false,
      filter : {
        "client._id" :item._id,
        "user._id" : userToken._id
      },
      fields:["note","message","_id"]
    }).then(avis=>setAvis(avis));
    API.clients.findOne({
      populate : false,
      filter : {
        "_id" :item._id,
      },
      fields:["note","votant"]
    }).then(item=>setNote(parseFloat(item.note? item.note: 0) / parseFloat(item.votant ?item.votant: 1)));
  },[]);
  return (
    <View style={styles.container}>
        <TopBar
          title={item.nom}
          logo={!!(item?.logo?.path) ? {uri:API.getAssetUri(item.logo.path)} : require("../assets/images/icon2.png")}
          rightIcon2Name="search"
          rightIcon2="heart"
          hasIcon={item.$icon ?? false}
        ></TopBar>
          <ScrollView
            horizontal={false}
            contentContainerStyle={styles.scrollArea_contentContainerStyle}
          >
              <View
                style={styles.image}
              >
          { (item?.gallery && item?.gallery?.length) ? <SliderBox
              images={[
                API.getAssetUri(item.image.path),
                ...item.gallery.map(image=>API.getAssetUri(image.path) )
              ]}
              sliderBoxHeight={styles.image.height}
              parentWidth={styles.image.width}
              dotColor = {global.config.color1}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                borderColor : "#FFEEF8",
                borderWidth : 1,
                padding: 0,
                margin: 0,
                backgroundColor : global.config.color1
              }}
              inactiveDotColor={global.config.color2}
              imageLoadingColor={global.config.color1}
              paginationBoxVerticalPadding={0}
              resizeMethod={'resize'}
              resizeMode={'cover'}
              autoplay
              circleLoop
            /> :
          <Image
            source={!!(item?.image?.path) ? {uri:API.getAssetUri(item.image.path)} : require("../assets/images/defaultEntrepriseImage.png")}
            resizeMode="cover"
            style={styles.image}
          ></Image>}
          <TouchableOpacity style={styles.favoris} onPress={()=>setAsFavori(item)}>  
            <MaterialCommunityIconsIcon
                name={isFavoris ? "heart" : "heart-outline"}
                style={[styles.icon3,{
                  color: isFavoris ? "red": "rgba(0,0,0,0.4)",
                  fontSize: 30
                }]}
              ></MaterialCommunityIconsIcon>
          </TouchableOpacity>
          <View style={[styles.categorie]}>
            <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
              <Image
                loadingIndicatorSource={<Circle />}
                source={ !!(item?.categorie?.icon?.path) ? {uri:API.getAssetUri(item.categorie.icon.path)} : require("../assets/images/icon.png")}
                resizeMode="contain"
                style={[styles.image,styles.iconCategorie]}
              />
              <View style={{height: 3, width: 3, padding:0, margin: 0}}></View>
              <Text style={styles.infoText}>
                {item?.categorie?.nom ?? "Pas de categorie"}
              </Text>
            </View>
            { distance != "" && <View style={{flexDirection:"row",alignItems:"center"}}>
              <Text style={styles.infoText}>Distance {distance}</Text>
            </View>}
          </View>
          <View style={[styles.solialIconContainer,{
              ...(item.linkedin || item.facebook || item.instagram ? {
                height: 50,
                maxWidth : 150,
                minWidth: 50,
                width : 50 * ((item.linkedin ? 1 : 0) + (item.facebook ? 1 : 0 ) + (item.instagram ? 1 : 0)) ,
                display: "flex",
                padding: 10,
              } : {}),
            }]}>
              {item.linkedin ? <TouchableOpacity style={styles.solialIcon}  onPress={()=>{
                Linking.openURL(`${item.linkedin}`.toLowerCase().trim());
              }}>
                <Image
                  source={require("../assets/images/linkedin.png")}
                  resizeMode="contain"
                  style={styles.solialIconImage}
                ></Image>
              </TouchableOpacity> : null}
              {item.instagram  ? <TouchableOpacity style={styles.solialIcon}  onPress={()=>{
                Linking.openURL(`${item.instagram}`.toLowerCase().trim());
              }}>

                <Image
                  source={require("../assets/images/instagram.png")}
                  resizeMode="contain"
                  style={styles.solialIconImage}
                ></Image>
              </TouchableOpacity>:null}
              {item.facebook ? 
              <TouchableOpacity style={styles.solialIcon} onPress={()=>{
                Linking.openURL(`${item.facebook}`.toLowerCase().trim());
              }}>
                <Image
                  source={require("../assets/images/facebook.png")}
                  resizeMode="contain"
                  style={styles.solialIconImage}
                ></Image>
              </TouchableOpacity> : null}
            </View>
          </View>            
            <View style={styles.rect4}></View>
            {
              !!pub && <View>
                <TouchableOpacity style={{
                  padding: 10,
                  marginHorizontal : 10,
                  marginVertical: 0,
                  height : 69,
                  flexDirection: "row",
                  backgroundColor : tinycolor(global.config.color2).setAlpha(0.20).toRgbString(),
                  borderRadius : 10,
                }}  onPress={()=>{
                  Linking.openURL(pub.lien);
                }}>
                <View style={{
                  flex: 1,
                }}><Text style={{
                  fontSize : 12,
                  paddingTop : 5,
                  fontFamily: "roboto-regular",
                }} numberOfLines={2}>{ pub?.description ?? ""}</Text>
                </View>
                </TouchableOpacity>
                <Text style={{
                  position: "absolute",
                  top : -8,
                  left: 5,
                  color : "white",
                  backgroundColor : "#e05b49",
                  padding : 3,
                  fontSize : 9,
                  borderRadius : 3,
                  fontFamily: "roboto-regular",
                }}>Publicité</Text>

                <TouchableOpacity style={{
                  width: 115,
                  position: "absolute",
                  bottom : -5,
                  right: 5,
                  flexDirection: "row",
                  backgroundColor : global.config.color2,
                  padding : 5,
                  alignItems:"center",
                  borderRadius : 5
                }}  onPress={()=>{
                  Linking.openURL(pub.lien);
                }}>
                  <MaterialIcon name="open-in-browser" style={{fontSize: 15, color:"white"}}></MaterialIcon>
                  <Text style={{fontSize: 13, paddingHorizontal: 5, color:"white", 
                  fontFamily: "roboto-regular",
                }}>En savoir plus </Text>
                </TouchableOpacity>

                <Text style={{
                  position: "absolute",
                  bottom : 3,
                  left: 20,
                  color : "rgba(0,0,0,0.7)",
                  padding : 3,
                  fontSize : 11,
                  borderRadius : 5,
                  fontFamily: "roboto-regular",
                }}> - {pub.client.nom}</Text>
              </View>
            }
            <View style={styles.rect4}></View>
            <ListInfoLine
              style={styles.listInfoLine}
              text={item.adresse || item?.position?.address} 
              icon="location-pin"
              ></ListInfoLine>
            <ListInfoLine
              text={item.telephone}
              icon="mobile"
              style={styles.listInfoLine}
            ></ListInfoLine>
            <ListInfoLine
              text={item.email}
              icon="email"
              style={styles.listInfoLine}
            ></ListInfoLine>
            <ListInfoLine
              icon="link"
              text={item.website}
              style={styles.listInfoLine}
            ></ListInfoLine>
            <ListInfoLine
              icon="back-in-time"
              text={item.horaires}
              style={styles.listInfoLine}
            ></ListInfoLine>
            <View style={styles.rect2}>
              <HTML html={item?.description ?? ""} imagesMaxWidth={Dimensions.get('window').width} />
            </View>
          </ScrollView>
          <FloatingAction
            floatingIcon={<MaterialCommunityIconsIcon
              name="menu"
              style={styles.icon2}
            ></MaterialCommunityIconsIcon>}
            actions={
              [...( item.telephone ? [{
                text: "Demande de RDV",
                color : "white",
                textBackground : global.config.color1,
                textColor: "#FFFFFF",
                icon: <MaterialCommunityIconsIcon
                  name="calendar-plus"
                  style={[styles.icon3,{
                    color: global.config.color1
                  }]}
                ></MaterialCommunityIconsIcon>,
                name: "bt_rdv",
                position: 1
              }] : []),...( item.telephone ? [{
                text: "Appeler",
                color : "white",
                textBackground : global.config.color1,
                textColor: "#FFFFFF",
                icon: <MaterialCommunityIconsIcon
                  name="phone"
                  style={[styles.icon3,{
                    color: global.config.color1
                  }]}
                ></MaterialCommunityIconsIcon>,
                name: "bt_call",
                position: 2
              }] : []),
              ...( item?.position?.lat && item?.position?.lng ? [{
                text: "Y Aller",
                color : "white",
                textBackground : global.config.color1,
                textColor: "#FFFFFF",
                icon: <MaterialCommunityIconsIcon
                      name="directions-fork"
                      style={[styles.icon3,{
                        color: global.config.color1
                      }]}
                    ></MaterialCommunityIconsIcon>,
                name: "bt_map",
                position: 3,
              }] : []),
              {
                text: "Partager",
                color : "white",
                textBackground : global.config.color1,
                textColor: "#FFFFFF",
                icon: <MaterialCommunityIconsIcon
                      name="share-variant"
                      style={[styles.icon3,{
                        color: global.config.color1
                      }]}
                    ></MaterialCommunityIconsIcon>,
                name: "bt_share",
                position: 4
              },{
                text: isFavoris ?"Retirer des favoris" :"Ajouter aux favoris",
                color : "white",
                textBackground : global.config.color1,
                textColor: "#FFFFFF",
                icon: <MaterialCommunityIconsIcon
                  name={isFavoris ? "heart" : "heart-outline"}
                  style={[styles.icon3,{
                    color: isFavoris ? "red": global.config.color1,
                    // fontSize: 30
                  }]}
                ></MaterialCommunityIconsIcon>,
                name: "bt_fav",
                position: 5
              }]
            }
            color={global.config.color1}
            position="right"
            onPressItem={name => {
              switch (name) {
                case "bt_fav":
                  setAsFavori(item);
                  break;
                case "bt_rdv":
                  showModal(true);
                  break;
                case "bt_call":
                  Linking.openURL(`tel://${item.telephone.replace(/\s+/,'').trim()}`);
                  break; 
                case "bt_share":
                  Share.share({
                    message:
                      API.template(global.config.share_template, item),
                  })
                  break; 
                case "bt_map":
                  var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
                  var location = `${item?.position?.lat},${item?.position?.lng}`;
                  var url = scheme + `${location}?q=${location}&z=16&center=${location}&saddr=&daddr=${location}&directionsmode=transit`;
                  Linking.openURL(url);
                  break;
                default:
                  break;
              }
            }}
          />
      
      {(!!note || note === 0) && <View style={[styles.avis, {
        borderColor : global.config.color1,
        borderWidth : 2
      }]} onPress={()=>setAsFavori(item)}>  
          <Rating
            type='custom'
            ratingImage={RATING_IMAGE}
            ratingColor={global.config.color1}
            ratingBackgroundColor='transparent'
            ratingCount={5}
            imageSize={25}
            startingValue={note}
            onFinishRating={(r)=>{
              setRating(r);
              showRatingModal(true);
            }}
            style={{ paddingVertical: 10 }}
          />
      </View>}
      <Modal
        visible={modalRatingVisible}
        overlayStyle = {{opacity: 0.3}}
        animationType='slide'
        isNative={true}
        title="Donnez votre avis"
        style={{
            height: 310,
        }}
        onRequestClose={()=>{
          setRating(0);
          setMotif("");
          showRatingModal(false);
        }}
      >
        <Text style={{
              fontSize: 13,
              fontWeight: "bold",
              textAlign: "left",
              textAlignVertical: "center",
            }}>Votre Note : {rating} </Text>
        <Rating
            type='custom'
            ratingImage={RATING_IMAGE}
            ratingColor={global.config.color1}
            ratingBackgroundColor='transparent'
            ratingCount={5}
            imageSize={25}
            startingValue={rating}
            onFinishRating={(r)=>{
              setRating(r);
            }}
            style={{ paddingVertical: 10 }}
          />
          <Text style={{
            fontSize: 13,
            fontWeight: "bold",
          }}>Votre avis</Text>
          <TextInput value={ avis?.message || motif} onChangeText={setMotif} multiline={true} numberOfLines={10} style={{
            borderColor: global.config.color1,
            borderWidth : 1,
            height: 100,
            textAlignVertical:"top",
            margin: 5,
            marginBottom: 10,
            borderRadius: 10,
            fontSize: 12,
            padding : 5,
          }}></TextInput>

          <TouchableOpacity style={{
            backgroundColor: global.config.color1,
            borderRadius: 20,
            height: 40,
            margin: 10,
            marginBottom:0,
            alignSelf: "stretch",
            alignItems:"center",
            justifyContent:"center",
          }} onPress={async ()=>{
            try{
              showSpinner(true);
              await API.avis.save({
                ...(avis ?  {_id : avis._id} : {}),
                client : {
                  "link": "clients",
                  "display": item.nom,
                  "_id":item._id
                },user : {
                  "link": "users",
                  "display": userToken.email,
                  "_id": userToken._id
                },
                note : rating,
                prevNote : avis?.note ?? 0,
                message : motif
              }).then(async res=>{
                setAvis(res);
                API.clients.findOne({
                  filter : {
                    "_id" : item._id,
                  },
                  populate : false,
                  fields : ["note","votant"]
                }).then(item=>
                  setNote(parseFloat(item.note? item.note: 0) / parseFloat(item.votant ?item.votant: 1))
                );
              });
              alert('Avis', "Votre avis a été envoyé",{
                type : 'info'
              });
              showRatingModal(false);
            }catch(e){
              console.error(e);
              alert('Erreur', "Le serveur de repond pas",{
                type : 'error'
              });
            }finally{
              showSpinner(false);
            }
          }}>
            <Text style={{color:"#FFFFFF", fontWeight: "bold"}}>Soumettre mon avis</Text>
          </TouchableOpacity>
      </Modal>
      <Modal
        overlayStyle = {{opacity: 0.3}}
        animationType='slide'
        isNative={true}
        onRequestClose={()=>{
          setMotif("");
          showModal(false);
        }}
        visible={modalVisible}
        title="Demande de prise de rendez-vous"
        style={
          dateVisible ? {
            height: 350,
          } : {
            height: 300,

          }
        }
      >

          <View style={{
            flexDirection:"row",
            justifyContent: "center",
            marginBottom: 10
          }}>
            <Text style={{
              fontSize: 13,
              fontWeight: "bold",
              width : 50,
              textAlign: "left",
              textAlignVertical: "center",
            }}>Raison</Text>
            {buttonVisible ? <TouchableOpacity
              onPress={() => {
                setPickerOpacity(1);
                setOpacityOfOtherItems(0); // THIS WILL HIDE YOUR BUTTON!
              }}
              style={{
                flexDirection: "row", 
                flex:1, 
                justifyContent: "flex-start", 
                alignItems:"center",
                display: opacityOfOtherItems == 0 ? 'none' : 'flex'
              }}>
              <Text style={{ flex:1 }}>{categorie_reservation[raison].nom}</Text>
              <MaterialCommunityIconsIcon
                name='chevron-down'
                color='#444'
                size={24}
                style={{marginRight:5}}
              />
            </TouchableOpacity> :
            <View style={{
              height: 25,
              borderColor: global.config.color1,
              borderRadius : 7,
              borderWidth : 1,
              alignSelf: 'center', 
              alignContent: "flex-start",
              justifyContent: "flex-start",
              // alignItems: "flex-end",
              // width: "100%",
              flex: 1,
            }}><Picker
            mode="dropdown"
            selectedValue={raison}
            itemStyle={{
              fontSize: 10
            }}
            style={{
              margin : 0,
              padding : 0,
              // position: "relative",
              top : 0,
              height : 23,
              // width : "100%",
              // backgroundColor:"red"
              }}
              onValueChange={(itemValue, itemIndex) =>{
                setRaison(itemIndex);
                showDate(categorie_reservation[itemIndex].date);
              }}
            >
              {
                categorie_reservation.map((el,index)=><Picker.Item key={el._id} label={el.nom} value={index} />)
              }
            </Picker></View>}
          </View>
          <Text style={{
            fontSize: 13,
            fontWeight: "bold",
          }}>Message</Text>
          <TextInput value={motif} onChangeText={setMotif} multiline={true} numberOfLines={10} style={{
            borderColor: global.config.color1,
            borderWidth : 1,
            height: 100,
            textAlignVertical:"top",
            margin: 5,
            marginBottom: 10,
            borderRadius: 10,
            fontSize: 12,
            padding : 5,
          }}></TextInput>
          {dateVisible && [
            <Text key="date-title" style={{
              fontSize: 13,
              fontWeight: "bold",
            }}>Date</Text>,
            <View key="date-piker" style={{
              alignContent:"center",
              // alignItems:"center",
              flexDirection: "row-reverse",
              borderColor: global.config.color1,
              borderWidth : 1,
              textAlignVertical:"top",
              margin: 5,
              marginBottom: 10,
              borderRadius: 10,
              fontSize: 12,
              padding : 5,
              height: 35,
              alignSelf:"stretch",
            }} >
              <Text onPress={()=>{showPicker(true)}} multiline={false} numberOfLines={1} style={{flex:1}}>{moment(date).format("dddd LL")}</Text>
              <MaterialCommunityIconsIcon
                name='calendar'
                color='#444'
                size={24}
                style={{marginRight:5}}
                onPress={()=>{showPicker(true)}}
              />
              {pickerVisible && (
                <DateTimePicker
                  testID="dateTimePicker"
                  minimumDate={moment().add(2,"days").toDate()}
                  value={date}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={(value)=>{
                    showPicker(false);
                    if(value?.nativeEvent?.timestamp){
                      setDate(value?.nativeEvent?.timestamp);
                    }
                  }}
                />
              )}
            </View>
          ]}
          <TouchableOpacity style={{
            backgroundColor: !motif.trim() || (dateVisible && !date) ? "rgba(0,0,0,0.1)" : global.config.color1,
            borderRadius: 20,
            height: 40,
            margin: 10,
            marginBottom:0,
            alignSelf: "stretch",
            alignItems:"center",
            justifyContent:"center",
          }} disabled={!motif || (dateVisible && !date)} onPress={async ()=>{
            try{
              showSpinner(true);
              console.log(userToken);
              await API.reservation.save({
                categorie: {
                  "link": "categorie_reservation",
                  "display": categorie_reservation[raison].nom,
                  "_id": categorie_reservation[raison]._id
                },client : {
                  "link": "clients",
                  "display": item.nom,
                  "_id":item._id
                },user : {
                  "link": "users",
                  "display": userToken.email,
                  "_id": userToken._id
                },
                description : motif,
                done : false,
                reject : false,
                ...(dateVisible ? {date : moment(date).format("YYYY-MM-DD")} : {})
              })
              alert('Demande envoyé', "Demmande en attente de traitement",{
                type : 'success'
              });
              showModal(false);
            }catch(e){
              console.error(e);
              alert('Erreur', "Le serveur de repond pas",{
                type : 'error'
              });
            }finally{
              showSpinner(false);
            }
          }}>
            <Text style={{color:!motif.trim() || !date ? "rgba(0,0,0,0.1)" : "#FFFFFF", fontWeight: "bold"}}>Demander un RDV</Text>
          </TouchableOpacity>
          {Platform.OS == "ios" && <View style={{
                position:"absolute",
                flex: 1,
                display: pickerOpacity == 0 ? 'none' : 'flex',
                alignSelf: 'center', 
                alignContent:"center",
                justifyContent: "center",
                width: Dimensions.get("window").width * 0.9,
                backgroundColor:"transparent",
                borderRadius : 20,
                padding : '5%',
                height : "100%",
                width : "100%",
              }}>
            <View style={{
                flex: 1,
                flexDirection : "column",
                display: 'flex',
                borderColor: global.config.color1,
                borderWidth : 2,
                backgroundColor:"#efefef",
                borderRadius : 20,
                alignItems : "center",
                alignContent:"center",
                justifyContent: "center",
                overflow:"hidden"
              }}>
              <Picker
                selectedValue={raison}
                itemStyle={{
                  fontSize: 10
                }}
                style={{
                  backgroundColor:"transparent",
                  borderRadius : 20,
                  height : "100%",
                  width : "100%",
                  flex: 1,
                  alignSelf: "center"
                }}
                onValueChange={(itemValue, itemIndex) =>{
                  if(buttonVisible){
                    setPickerOpacity(0);
                    setOpacityOfOtherItems(1);
                  }
                  setRaison(itemIndex);
                  showDate(categorie_reservation[itemIndex].date);
                }}
              >
                {
                  categorie_reservation.map((el,index)=><Picker.Item key={el._id} label={el.nom} value={index} />)
                }
              </Picker>
            </View>
          </View>}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rdvDialog : {
    width: Dimensions.get("window").width - 24,
    height: 350,
    maxHeight: Dimensions.get("window").height * 0.7,
    marginHorizontal: 24,
    padding: 0,
    borderTopLeftRadius : 20,
    borderTopRightRadius : 20,
    flexDirection: "column",
    alignItems:"flex-start",
    alignContent:"flex-start",
    justifyContent:"flex-start",
  } ,
  spacer1: {
    alignSelf: "stretch",
    height: 24
  },
  scrollArea_contentContainerStyle: {
    // height: 680,
    alignSelf: "stretch",
    // width: 360
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width / 1.8,
    alignSelf: "stretch"
  },
  favoris : {
      position: "relative",
      // top: 56 + Constants.statusBarHeight + styles.image.height - 50,
      top : -56,
      left: Dimensions.get('window').width - 60 ,
      width: 50,
      height: 50,
      backgroundColor: "rgba(255,255,255,0.6)",
      borderRadius: 50,
      alignItems: "center",
      justifyContent : "center",
  },
  avis : {
    position: "absolute",
    // top: 56 + Constants.statusBarHeight + styles.image.height - 50,
    bottom : 30,
    left:  20 ,
    width: 150,
    height: 50,
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 50,
    alignItems: "center",
    justifyContent : "center",
},
  solialIconContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    display: "none",
    // width : 120,
    width: 120,
    height: 40,
    position : "relative",
    top : -136 ,//-105,
    left: 10,
    backgroundColor : "rgba(255,255,255,0.6)",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    borderRadius: 25,
    // borderTopLeftRadius: 0,
    // borderBottomRightRadius: 0,
    // borderBottomLeftRadius: 0,
  },
  solialIconImage: {
    width: 24,
    height: 24,
  },
  solialIcon: {
    width: 25,
    height: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3
  },
  rect3: {
    width: 105,
    height: 55,
    alignItems: "center",
    justifyContent: "space-around"
  },
  icon2: {
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    padding: 5
  },
  appeler1: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)"
  },
  icon3: {
    fontSize: 20,
    padding: 5
  },
  yAller3: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)"
  },
  rect4: {
    height: 15,
    alignSelf: "stretch"
  },
  listInfoLine: {
    height: 55,
    alignSelf: "stretch"
  },
  rect2: {
    padding : 20,
    paddingBottom: 70,
    flexDirection: "row",
    alignSelf: "stretch"
  },
  loremIpsum: {
    fontFamily: "roboto-regular",
    color: "#121212",
    height: 140,
    flex: 1,
    margin: 10,
    fontSize: 12
  },
  categorie : {
    // paddingTop: 2,
    paddingHorizontal: 10,
    position: "relative",
    top: -250,
    // left: "10%",
    maxWidth : "80%",
    marginHorizontal: "10%",
    margin: 0,
    height: 30,
    backgroundColor: "rgba(255,255,255, 0.75);",
    padding: 5,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "center",
    flexDirection: "row",
  },
  iconCategorie : {
    width: 20,
    height: 20,
    // backgroundColor: "red",
  },
  infoText :{
    color: "#000000",
    fontSize: 10
  }
});
function ratingCompleted(rating) {
  console.log("Rating is: " + rating)
}
export default Fiche;
