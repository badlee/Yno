 
import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Agenda,LocaleConfig} from 'react-native-calendars';
import {moment} from "../context/LocationContext";
import SearchItemRDV from "../components/SearchItemRDV";
import tinycolor from 'tinycolor2';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
  today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'fr';
var dateFormat = "YYYY-MM-DD";
var dots = {
  "reject" : {key:'rejected', color: 'red'},
  "wait" : {key:'await', color: 'white', selectedDotColor: 'orange'},
  "accept" : {key:'accepted', color: 'green'},
};
const testIDs = {
  CONTAINER: 'agenda',
  ITEM: 'item'
};



export default class Schedule extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      date : moment().toDate(),
      ...( props.dataArray ? props.dataArray.filter(el=>el.date).reduce((ret, item)=>{
        var key = item.date;
          ret.markedDates[key] = ret.markedDates[key] || { marked: true, dots: []};
          var type = item.reject === false ? (item.done == false ? "wait" : "accept") : "reject";
          if(-1 == ret.markedDates[key].dots.indexOf(dots[type]))
            ret.markedDates[key].dots.push(dots[type]);
          ret.items[key] = ret.items[key] || [];
          ret.items[key].push(item);
          return ret;
        },{
          items :{},
          markedDates : {}
        }) :{}),
    };
  }
  render() {
    return (
      <Agenda
        testID={testIDs.CONTAINER}
        items={this.state.items}
        loadItemsForMonth={this.loadItemsForMonth.bind(this)}
        selected={this.state.date}
        onDayChange={(date)=>this.setState({date})}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={null}
        rowHasChanged={this.rowHasChanged.bind(this)}
        markingType="multi-dot"
        markedDates={this.state.markedDates}
        // monthFormat={'yyyy'}
        theme={{
          calendarBackground: tinycolor(global.config.color1).lighten(7).toRgbString(),
          // backgroundColor: "white",
          todayTextColor : "white",
          agendaDayTextColor : "white",
          dayTextColor : "white",
          agendaKnobColor: "white",
          selectedDayBackgroundColor : "white",
          selectedDayTextColor : global.config.color1,
          'stylesheet.day.multiDot': {
            selected: {
              backgroundColor : "white",
              borderRadius: 5
            }
          },
          textSectionTitleColor: "white",
          monthTextColor: "white",
        }}
        renderDay={(day, item) =>{
          var selected = false;
          if(day){
            var date = moment(day.timestamp);
            selected = true;//date.format("LL") == moment(this.state.date).format("LL");
            console.log( selected, this.state.date);
          }
          return  <View style={{
            flexDirection : "column",
            width : 50,
            margin : 5,
            backgroundColor : selected ?  tinycolor(global.config.color1).lighten(7).toRgbString() :  "transparent",
            borderRadius : selected ? 10 : 0,
            justifyContent : "flex-start",
            alignItems :"center",

          }}>
            {!!day && !!item  && [<Text key="day" style={{
              fontSize : 35,
              color : selected ? "white" : undefined,
            }}>{date.format("DD")}</Text>,
            <Text key="month" style={{
              position:"relative",
              top : -10,
              fontSize : 15,
              color : selected ? "white" : undefined,
              fontWeight :"100"
            }}>{date.format("MMM")}</Text>]}
            </View>;
        }}
        hideExtraDays={false}
      />
    );
  }

  loadItemsForMonth(data) {
    setTimeout(()=>{
      const  {day,month,year, dateString} = data;
      var items = this?.state?.items ?? {};
      if(items[dateString] == null){
        items[dateString] = [];
        this.setState({
          items
        });
      }
      // console.log(this.state.items);

    },150);
  }

  renderItem(item) {
    return (
      <SearchItemRDV
        key={"result-"+item._id}
        item={item}
        style={styles.item}
      />
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    height: 100
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});