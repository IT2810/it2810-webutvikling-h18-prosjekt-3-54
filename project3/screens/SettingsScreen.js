import React, {Component} from 'react';
import { ExpoConfigView } from '@expo/samples';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
  Button,
  Alert
} from 'react-native';


  export default class SettingsScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state;
    return {
      title: "Contacts",
      headerRight:<Button
                    onPress={() => params.handleCreateNewContact()}
                    title="+"
                    color="#33b2ff"
                    accessibilityLabel="Click to create a new contact."
                  />
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleCreateNewContact: this._createNewContact });
    }

  _createNewContact = () => {
    alert("Coming soon.");
  }

  render() {
    return (
      <View>
        <ScrollView>
          
        </ScrollView>
      </View>
    );
  }
}
