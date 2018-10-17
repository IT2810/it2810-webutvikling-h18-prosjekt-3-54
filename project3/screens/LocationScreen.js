import React from 'react';
import { StyleSheet, View, Button, AsyncStorage } from 'react-native';
import { Location, Permissions } from 'expo';
import MapView from 'react-native-maps';

export default class LocationScreen extends React.Component {
  
  state = {
    coords: {
        longitude: 15.25512,
        latitude: 54.25296,
    },
    deltas: 100,
    savedCoords: {
        longitude: null,
        latitude: null,
    },
  };

 
  //Spørrer devicen om tillatelse til å få tilgang til lokasjon. Henter koordinater til lokasjonen og setter staten.
  getCurrentLoc = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert.alert('Location error', 'Permission to access location was denied.');
    }

    let location = await Location.getCurrentPositionAsync({});
    let coordsLatitude = location.coords.latitude;
    let coordsLongitude = location.coords.longitude;
    this.setState({ coords: {latitude: coordsLatitude, longitude: coordsLongitude} }); 
    this.setState({deltas: 0.02});   
  };
  

  //Henter lokasjonen til devicen og lagrer nåværende koordinater på devicen.
  saveLoc = async () => {
    let location = await Location.getCurrentPositionAsync({});
    let coords = {longitude: location.coords.longitude, latitude: location.coords.latitude};
    try {
      await AsyncStorage.setItem('coords', JSON.stringify(coords));
    } catch (error) {
      alert.alert('Location saving error');
    }
  }

  //Henter koordinater til forrige plass som ble lagret, og bruker disse for å sette koordinat-staten.
  showLastLoc = async () => {
    try {
      const savedCoords = await AsyncStorage.getItem('coords');      
      if (savedCoords !== null) {
        savedCoords = JSON.parse(savedCoords);
        this.setState( { savedCoords });
        let coordsLatitude = savedCoords.latitude;
        let coordsLongitude = savedCoords.longitude;
        this.setState({ coords: {latitude: coordsLatitude,
                                longitude: coordsLongitude} });
        this.setState({deltas: 0.02});
      }
     } catch (error) {
      alert.alert('Data retrieving error');
     }
  }

  //Brukes av MapView for å sette området kartet skal vise.
  getMapRegion = () => (   
    {
    latitude: this.state.coords.latitude,
    longitude: this.state.coords.longitude,
    latitudeDelta: this.state.deltas,
    longitudeDelta: this.state.deltas
  });




  render() {
    let locationMarker = null;

    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {

    }

    //Hvis det fins koordinater å vise, vises de med en Marker.
    if (this.state.coords.latitude !== 54.25296) {
        locationMarker = <MapView.Marker coordinate={this.state.coords} />;
    }
   


    return (
      <View style={styles.container}>
        <View style={styles.button}><Button onPress={this.getCurrentLoc} title="Your location" /></View>
        <View style={styles.button}><Button style={styles.button} onPress={this.saveLoc} title="Save your location" /></View>
        <View style={styles.button}><Button style={styles.button} onPress={this.showLastLoc} title="Show last saved location" /></View>
        <MapView style={styles.map} region={this.getMapRegion()}>
         {locationMarker} 
         </MapView>
        
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
  },

  map: {
      flex: 1,
      width: '100%',
      height: '70%',
      paddingTop: 10,
      paddingBottom: 10,
  },

  button: {
    padding: 10,
  },

});
