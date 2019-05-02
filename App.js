/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,ImageBackground ,KeyboardAvoidingView,ActivityIndicator,StatusBar} from 'react-native';
import SearchInput from './components/SearchInput'
import getImageForWeather from './utils/getImageForWeather'
import {fetchLocationId, fetchWeather} from './utils/api';



export default class App extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:false,
      error:false,
      location:'',
      temperature: 0,
      weather: '',
    };
  }
  componentDidMount(){
    this.handleUpdateLocation('San Francisco')
  }
  
  handleUpdateLocation= async city =>{
    if(!city) return;

    this.setState({loading:true},async()=>{
      try{
        const locationId = await fetchLocationId(city);
        const {location,weather,temperature} = await fetchWeather(
          locationId
        );
       this.setState({
         loading:false,
         error:false,
         location,
         weather,
         temperature,
       })
      } catch (e) {
        this.setState({
          loading:false,
          error:true,
        })
      }
    })
  };

  render() {
    const {location,loading,error,temperature,weather} = this.state
    return (
      <KeyboardAvoidingView style={styles.container}>
        <StatusBar barStyle='light-content'/>
        <ImageBackground
        source={getImageForWeather(weather)}
        style={styles.imageContainer}
        >

          <ActivityIndicator animating={loading} color='white' size='large'/>
          {!loading && (
            <View>
              {
                error && (
                  <Text style={[styles.smallText,styles.textStyle]}>
                    Could not load weather,please try a different city.
                  </Text>
                )
              }
              {!error && (
                <View>
                 <Text style={[styles.largeText,styles.textStyle]}>{location}</Text>
                 <Text style={[styles.smallText,styles.textStyle]}>{weather}</Text>
                 <Text style={[styles.largeText,styles.textStyle]}>{Math.round(temperature)}°</Text>
                 </View>
              )}
           
        <SearchInput 
        placeholder='Search any city'
        onSubmit={this.handleUpdateLocation}
        />
        </View>
        )}
        
        </ImageBackground>
      </KeyboardAvoidingView>
     );
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  textStyle: {
    textAlign:'center',
    fontFamily: Platform.OS==='ios'?'AvenirNext-Regular':'Roboto',
  },
  largeText:{
    fontSize:44,
  },
  smallText:{
    fontSize:18
  },
  imageContainer:{
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
    height:'100%',
    resizeMode:'cover'
  },


});
