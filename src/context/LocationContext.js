import * as React from 'react';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import DropdownAlert from 'react-native-dropdownalert';
import { Alert, Dimensions,StatusBar, AsyncStorage, Image } from 'react-native';
import moment from "moment";
import API from '../../API';
const WINDOW = Dimensions.get('window');
moment.locale('fr', {
  months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
  monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
  monthsParseExact : true,
  weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
  weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
  weekdaysParseExact : true,
  longDateFormat : {
      LT : 'HH:mm',
      LTS : 'HH:mm:ss',
      L : 'DD/MM/YYYY',
      LL : 'D MMMM YYYY',
      LLL : 'D MMMM YYYY HH:mm',
      LLLL : 'dddd D MMMM YYYY HH:mm'
  },
  calendar : {
      sameDay : '[Aujourd’hui à] LT',
      nextDay : '[Demain à] LT',
      nextWeek : 'dddd [à] LT',
      lastDay : '[Hier à] LT',
      lastWeek : 'dddd [dernier à] LT',
      sameElse : 'L'
  },
  relativeTime : {
      future : 'dans %s',
      past : 'il y a %s',
      s : 'quelques secondes',
      m : 'une minute',
      mm : '%d minutes',
      h : 'une heure',
      hh : '%d heures',
      d : 'un jour',
      dd : '%d jours',
      M : 'un mois',
      MM : '%d mois',
      y : 'un an',
      yy : '%d ans'
  },
  dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
  ordinal : function (number) {
      return number + (number === 1 ? 'er' : 'e');
  },
  meridiemParse : /PD|MD/,
  isPM : function (input) {
      return input.charAt(0) === 'M';
  },
  // In case the meridiem units are not separated around 12, then implement
  // this function (look at locale/id.js for an example).
  // meridiemHour : function (hour, meridiem) {
  //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
  // },
  meridiem : function (hours, minutes, isLower) {
      return hours < 12 ? 'PD' : 'MD';
  },
  week : {
      dow : 1, // Monday is the first day of the week.
      doy : 4  // Used to determine first week of the year.
  }
});
moment.fn.greeting = function () {
	var g = null; //return g
	
	if(!this || !this.isValid()) { return; } //if we can't find a valid or filled moment, we return.
	
	var split_afternoon = 12 //24hr time to split the afternoon
	var split_evening = 17 //24hr time to split the evening
	var currentHour = parseFloat(this.format("HH"));
	
	if(currentHour >= split_afternoon && currentHour <= split_evening) {
		g = "Bonjour"; // apres midi
	} else if(currentHour >= split_evening) {
		g = "Bonsoir";
	} else {
		g = "Bonjour";
	}
	
	return g;
}
var favorisRequestCache = {};
const Context = React.createContext();

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  lat1 = parseFloat(lat1);
  lon1 = parseFloat(lon1);
  lat2 = parseFloat(lat2);
  lon2 = parseFloat(lon2);
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function displayMeter(distance) {
  distance = Math.abs(distance);
  if(distance < 1){ // display meters
    var parts = (distance * 1000).toFixed(0).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".") + " m";
  }else if(distance){
    var parts = distance.toFixed(0).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".") + " km";
  }
}

export {
  Context,
  displayMeter,
  getDistanceFromLatLonInKm,
  moment
};

export default (props) => {
  const [spinner, showSpinner] = React.useState(false);
  const [myLocationStatus, setMyLocationStatus] = React.useState(null);
  const [myLocation, setMyLocation] = React.useState(null);
  const [userToken, setUserToken] = React.useState(null);
  const [isGpsLocation, setIsGpsLocation] = React.useState(false);
  const [myLocationPlace, setMyLocationPlace] = React.useState(null);
  const [alert, setDropDownAlertRef] = React.useState(null);
  const [history, setHistory] = React.useState([]);
  const [favoris, setFavoris] = React.useState([]);
  const [init, setInit] = React.useState(false);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  // var initPromise = new Promise(ok=>{init = ok;});
  const _getLocation = async ()=>{
    try{
      var res = await fetch("http://www.geoplugin.net/json.gp");
      res = await res.json();
      setMyLocation({
        coords: {
          latitude  : parseFloat(res.geoplugin_latitude),
          longitude : parseFloat(res.geoplugin_longitude),
          accuracy  : parseFloat(res.geoplugin_locationAccuracyRadius),
          altitude  : 0,
          heading   : 0,
          speed     : 0,
        },
        timestamp: Date.now(),
      });
      setMyLocationPlace({
        city: res.geoplugin_city,
        region: res.geoplugin_regionName,
        country: res.geoplugin_countryName,
        street: "",
        postalCode: "",
        name: "",
      });
    }catch(e){
      console.error("Erreur ",e);
    }
  } 
  const _init = async (type) => {
    _getLocation();
    // await AsyncStorage.clear();
    var res = await AsyncStorage.getItem("userToken");
    if(res){
      var user = JSON.parse(res);
      var fav = await API.favoris.find({
        filter:{
          "user._id" : user._id
        },
        fields : ["client"], 
        populate :  false
      });
      setFavoris(fav.map(el=>el.client._id));
      setUserToken(user);
      console.log("userToken",userToken);
      console.log("Favoris",favoris);
    }
    // await AsyncStorage.removeItem("history");
    var history =  await AsyncStorage.getItem("history")
    history = history ? JSON.parse(history) : [];
    setHistory(history);
    console.log("history",history);
    setInit(true);
    forceUpdate();
    setTimeout(()=>{
      Permissions.askAsync(Permissions.LOCATION).then(async ({ granted,status })=>{
        console.log(granted,status );
        setMyLocationStatus(status);
        if(granted){
          var ret = await Location.getCurrentPositionAsync();
          setMyLocation(ret);
          setMyLocationPlace((await Location.reverseGeocodeAsync(ret.coords))[0]);
          setIsGpsLocation(true);
        }else{
        }
      });
    },5000);

  };
  React.useEffect(() => {
      _init(); 
  }, []);
  return ( init ?
      <Context.Provider value={{
        init,
        history,
        addHistory(item){
          var h = history.filter(i=>item._id != i._id);
          h.unshift(item);
          h = h.slice(0,20);
          AsyncStorage.setItem("history",JSON.stringify(h)).then(()=>{
            setHistory(h);
          });
        },
        userToken,
        async removeUserToken(){
          return AsyncStorage.removeItem("userToken").then((e)=>{
            setUserToken(null);
            return e;
          });
        },
        async setUserToken(user){
          return AsyncStorage.setItem("userToken",JSON.stringify(user)).then(()=>{
            setUserToken(user);
            forceUpdate();
            return user;
          })
        },
        favoris,
        isFavoris(item){
          return favoris.findIndex(id=>item._id == id) != -1;
        },
        favorisIsOnChange(item){
          return !!favorisRequestCache[item._id];
        },
        async setAsFavori(item){
          if(favorisRequestCache[item._id]) return;
          var isSet = false;
          try{
            favorisRequestCache[item._id] = true;
            var isFav = favoris.findIndex(id=>item._id == id);
            if(isFav == -1){
              await API.favoris.save({
                client : {
                  "link" : "clients",
                  "display" : item.nom,
                  "_id" : item._id
                },
                user : {
                  "link" : "users",
                  "display" : userToken.nom,
                  "_id" : userToken._id
                },
              }).then(res=>{
                console.log(favoris);
                favoris.push(item._id);
                console.log(favoris);
                setFavoris(favoris);
                isSet = true;
              });
            }else{
              await API.favoris.delete({
                filter :{
                  "client._id" : item._id,
                  "user._id" : userToken._id,
                }
              }).then(res=>{
                console.log(favoris);
                favoris.splice(isFav, 1);
                console.log(favoris);
                setFavoris(favoris);
                isSet = true;
              })
            }
          }catch(e){
            alert.alertWithType("error","Favoris", "Erreur lors de l'enregistrement du favoris");
            console.error(e);
          } finally{
            favorisRequestCache[item._id] = false;
            delete  favorisRequestCache[item._id];
            if(isSet) forceUpdate();
          }
        },
        myLocationStatus,
        myLocation,
        isGpsLocation,
        myLocationPlace,
        spinner, showSpinner,
        isReady : alert != null,
        alert(title, message,options){
          if(alert)
            alert.alertWithType(options?.type ?? "info", title, message);
          else
            Alert.alert(title, message);
        }
      }}>
      <DropdownAlert
        updateStatusBar={false} 
        panResponderEnabled={false} 
        ref={ref => setDropDownAlertRef(ref)}
        titleTextProps={{
          marginTop : StatusBar.currentHeight +  10
        }}
      />
        {props.children}
      </Context.Provider> : <Image
              source={global.colors.SPLASH}
              resizeMode="cover"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
  );
};;