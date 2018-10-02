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
import t from 'tcomb-form-native';

const Form = t.form.Form;

const User = t.struct({
  name: t.String,
  number: t.String,
  email: t.maybe(t.String)
});

const options = {
  fields: {
    name: {
      error: 'Please enter a name.'
    },
    number: {
      error: 'Please enter a number.'
    }
  },
};

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

  // when "+" sign/create new contact listener
  _createNewContact = () => {
    alert("Coming soon.");
  }

  // add contact
  _handleSubmitContact = () => {
    const value = this._form.getValue();
  }

  render() {
    return (
      <View style = {styles.container}>
        <ScrollView>
          <Form type={User}
            ref={c => this._form = c}
            options={options} />
          <Button
            title="Add to contacts"
            onPress={this._handleSubmitContact}
            //style = {styles.buttons}
            color="#841584"
          />
        </ScrollView>
      </View>
    );
  }
}

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#ffffff'
    },
  });
