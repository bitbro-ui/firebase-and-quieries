import React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Transactionscreen from './screens/Transactionpage';
import Searchscreen from './screens/Searchpage';

export default class App extends React.Component{
  render(){
  return (
    <AppContainer/>
  );
}
}

const TabNavigator = createBottomTabNavigator({
  Transaction:{screen:Transactionscreen},
  Search:{screen:Searchscreen}
},
{
  defaultNavigationOptions:({navigation})=>({
    tabBarIcon:({})=>{
      const routeName = navigation.state.routeName
      if(routeName==='Transaction'){
        return(
        <Image source={require ('./assets/book.png')}
        style = {{width:50,height:50}}
        />
        )
      }
      else if(routeName === 'Search'){
        return(<Image source={require ('./assets/searchingbook.png')}
        style = {{width:50,height:50}}
        />)
      }
    }
  })
})

const AppContainer = createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
