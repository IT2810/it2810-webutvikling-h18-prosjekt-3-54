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
  Button,
  Modal,
  TouchableHighlight,
  FlatList
} from 'react-native';
import t from 'tcomb-form-native';
import Row from '../components/Row';
import { Header } from 'react-navigation';

const Form = t.form.Form;
//imported tcomb for creation of contact form
const User = t.struct({
  fullName: t.String,
  number: t.Number,
  email: t.maybe(t.String)
});

const options = {
  fields: {
    fullName: {
      error: 'Please enter a valid name.'
    },
    number: {
      error: 'Please enter a number.'
    }
  },
};

let contactList = [];

export default class ContactsScreen extends React.Component {

  constructor(props) {
    super(props);

    //datasource
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['row1', 'row2']),
      modalVisible: false,
      data: [],
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state;
    return {
      title: "Contacts",
      headerRight:<Button
                    onPress={() => params.handleCreateNewContact()}
                    title="New contact"
                    color="#33b2ff"
                    accessibilityLabel="Click to create a new contact."
                  />,
      headerLeft:<Button
                    onPress={() => params.handleDeleteAllContacts()}
                    title="Delete all"
                    color="#33b2ff"
                    accessibilityLabel="Click to delete all contacts."
                    />
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleCreateNewContact: this._createNewContact });
    this.props.navigation.setParams({ handleDeleteAllContacts: this._deleteAllContacts });
  }

  // opens the modal window where a new contact may be created
  _createNewContact = () => {
    this.setModalVisible(true);
  }

  //deletes all keys from async
  _deleteAllContacts = async () => {
    try {
      AsyncStorage.getAllKeys()
      .then(AsyncStorage.multiRemove)
    } catch (error) {
      console.log("clear error");
    }
  }

  //saves the new contacts in asyncStorage
  _handleSaveContact = async () => {
    const value = this._form.getValue();
    let contactFullName = value['fullName'];
    let contactNumber = value['number'];
    let newContact = {fullName: contactFullName, number: contactNumber};
    try {
      await AsyncStorage.setItem(contactFullName, JSON.stringify(newContact));
      //updateTable() ??

      this.setModalVisible(!this.state.modalVisible);
    } catch (error) {
      console.log("error saving contact");
    }
    this._consoleTest();
  }

  //basically to just iterate keys and values for logging
  _consoleTest = async () => {
    let newC = [];
    try {
      let keys = AsyncStorage.getAllKeys()
        .then((ks) => {
          console.log("all keys = " + ks);
          ks.forEach((k) => {
            AsyncStorage.getItem(k)
            .then((v) => {
              //add to dict/array
              let valueL = JSON.parse(v);
              console.log("Name = " + k + ", Number = " + valueL.number);

            });
          });
        });
    } catch (error) {
      console.log("error consoleTest");
    }
  }

  // removes modal and goes back to Contact window
  _handleCancelSaveContact = () => {
    this.setModalVisible(!this.state.modalVisible);
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight underlayColor='#dddddd' style={styles.listStyle}>
        <View>
          <Text style={styles.listTextStyle} numberOfLines={1}>{rowData}</Text>
          <View style={{height: 1, backgroundColor:'#000000'}}></View>
        </View>
      </TouchableHighlight>
    )
  }

  _renderItem = (props) => {
    var person = props['item'];
    return
  }

  render() {
    return (
      <View style = {styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}>
          <View style = {styles.modalContainer}>

            <Form type={User}
              ref={c => this._form = c}
              options={options} />
            <Button
              title = "Cancel"
              onPress = {this._handleCancelSaveContact}
              style = {styles.cancelButton}
            />
            <Button
              title="Add to contacts"
              onPress={this._handleSaveContact}
              style = {styles.addButton}
            />
          </View>
        </Modal>
        
      
      <ListView
          dataSource={this.state.dataSource}
          //renderRow={this.renderRow.bind(this)}
          renderRow={(rowData => <Text>{rowData}</Text>)}
      />

      </View>
    );
  }
}

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      flex: 1,
    },
    modalContainer: {
      padding: 20,
      marginTop: Header.HEIGHT,
    },
    cancelButton: {
      color: '#841584',
    },
    addButton: {
      color: '#841584',
    },
    /*
    separator: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: '#8E8E8E',
    },
    */
    listStyle: {
      height: 35,
    },
    listTextStyle: {
      fontSize: 16,
      color: '#000000',
    }
  });
  