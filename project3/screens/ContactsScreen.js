import React, {Component} from 'react';
import { ExpoConfigView } from '@expo/samples';
import {
  Image,
  Platform,
  ScrollView,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
  Button
} from 'react-native';
import t from 'tcomb-form-native';
import Row from '../components/Row';

const Form = t.form.Form;

const User = t.struct({
  firstname: t.String,
  lastName: t.maybe(t.String),
  number: t.String,
  email: t.maybe(t.String)
});

const options = {
  fields: {
    firstname: {
      error: 'Please enter a name.'
    },
    number: {
      error: 'Please enter a number.'
    }
  },
};


export default class ContactsScreen extends React.Component {

  constructor(props) {
    super(props);

    //datasource listview/table
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['row1', 'row2']),
    };
  }

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

          <ListView
          dataSource={this.state.dataSource}
          renderRow={(data) => <Row {...data} />}
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
