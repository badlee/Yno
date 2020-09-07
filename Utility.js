import * as React from 'react';
import { View, Text ,Button,Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
const drawer = createDrawerNavigator();
const stack = createStackNavigator();

export function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={{uri:'https://react.semantic-ui.com/logo.png'}}
    />
  );
}


export function HomeScreen({ navigation }) {
  const [count, setCount] = React.useState(0);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => setCount(c => c + 1)} title="+" />
      ),
    });
  }, [navigation]);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Text>Count: {count}</Text>
      <Button
        title="Go to Details ++"
        onPress={() => {
          /* 1. Navigate to the Details route with params */
          console.log(navigation);
          navigation.navigate('Details', {
            itemId: 86,
            otherParam: 'anything you want here',
          });
        }}
      />
    </View>
  );
}

export function DetailsScreen({ route, navigation }) {
  /* 2. Get the param */
  const { itemId } = route.params;
  const { otherParam } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <Button
        title="Go to Details... again"
        onPress={() =>
          navigation.push('Details', {
            itemId: Math.floor(Math.random() * 100),
            otherParam: '@ID::'+Math.floor(Math.random() * 100),
          })
        }
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

export function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

export class Drawer extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return <View>{this.props.children}</View>
  }
}
export class Splash extends React.Component {
  constructor(props) {
    super(props);
  }
}
export class Screen extends React.Component {
  constructor(props) {
    super(props);
  }
  getScreen(isDrawer){
    return isDrawer ? 
    <drawer.Screen {...this.props}/> :
    <stack.Screen {...this.props}/>;
  }
}
export class AuthScreen extends Screen {
  constructor(props) {
    super(props);
  }
}
export class LoginScreen extends Screen {
  constructor(props) {
    super(props);
  }
}

export class App extends React.Component {
  constructor(props) {
    super(props);
    // We declare the state as shown below
    this.drawerView = props.children.filter(el=>el.type == Drawer).pop();// get last element
    this.splashView = props.children.filter(el=>el.type == Splash).pop();// get last element
    // screens
    this.authScreens = props.children.filter(el=>el.type == AuthScreen);// get last element
    this.screens = props.children.filter(el=>el.type == Screen);
    // drawer
    this.drawerFn= this.drawerView? this.getDrawer.bind(this) : null;
    this.state = props.initialState || {};
  }

  getDrawer(){
    return this.drawerView;
  }
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator>
          
        </Stack.Navigator>;
      </NavigationContainer>
    );
  }
}