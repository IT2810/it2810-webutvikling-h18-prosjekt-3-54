import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Button,
  Modal,
  FlatList,
} from 'react-native';
import t from 'tcomb-form-native';
import { Header } from 'react-navigation';


const Form = t.form.Form;
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


export default class ContactsScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      data: [], //Contacs information will go in here
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state;
    return {
      title: "",

      headerRight:<Button
                    onPress={() => params.handleCreateNewContact()}
                    title="New contact"
                    color="#33b2ff"
                    accessibilityLabel="Click to create a new contact."
                  />
                  ,
      headerLeft:<Button
                    onPress={() => params.handleDeleteAllContacts()}
                    title="Delete all"
                    color="#33b2ff"
                    accessibilityLabel="Click to delete all contacts."
                    />,
      
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleCreateNewContact: this._createNewContact });
    this.props.navigation.setParams({ handleDeleteAllContacts: this._deleteAllContacts });
    this.fetchData();
  }



  fetchData = async () => {
    let contacts = []
    try {
      let keys = await AsyncStorage.getAllKeys()
        .then((ks) => {
          console.log("all keys = " + ks);
          ks.forEach((k) => {
            AsyncStorage.getItem(k)
            .then((v) => {
              //add to dict/array
              let value = JSON.parse(v);
              
              if(value.identifikator === 'contact') {
                let contact = {'fullName': value.fullName, 'number' : value.number, 'email': value.email}
                contacts.push(contact);
                //console.log(contacts);
                this.setState({data: contacts});
                
              }
            });
          });
        });
        
      } catch (error) {
      console.log("error consoleTest");
    }
  }


  // opens the modal window where a new contact may be created
  _createNewContact = () => {
    this.setModalVisible(true);
  }

  // deletes every key tagged with 'contact'
_deleteAllContacts = async () => {
  try {
    let keys = await AsyncStorage.getAllKeys()
      .then((ks) => {
        ks.forEach((k) => {
          AsyncStorage.getItem(k)
          .then((v) => {
            let value = JSON.parse(v);
            if(value.identifikator === 'contact') {
              let key = value.fullName;
              AsyncStorage.removeItem(key);
            }
          });
        });
      });
      
    } catch (error) {
    console.log("error consoleTest");
  }
  this.setState({data: []});
}
  //saves the new contacts in asyncStorage
  _handleSaveContact = async () => {
    const value = this._form.getValue();
    let contactFullName = value['fullName'];
    let contactNumber = value['number'];
    let contactEmail = value['email'];
    let newContact = {identifikator: 'contact', fullName: contactFullName, number: contactNumber, email: contactEmail};
    try {
      await AsyncStorage.setItem(contactFullName, JSON.stringify(newContact));
      this.setModalVisible(!this.state.modalVisible);
    } catch (error) {
      console.log("error saving contact");
    }
    this.fetchData();
  }

  // removes modal and goes back to Contact window
  _handleCancelSaveContact = () => {
    this.setModalVisible(!this.state.modalVisible);
  }



  render() {
    return (
      <View style = {styles.container}>
        <Modal
          style={styles.modalStyle}
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
        <Text style={styles.heading}>Contacts</Text>
        <FlatList
        data={this.state.data}
        keyExtractor={(x, i) => i}
        renderItem={({item}) => 
        <Text style={styles.listTextStyle}>Navn: {item.fullName}, Tlf: {item.number}, Email: {item.email}</Text>}
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
    
    listStyle: {
      height: 35,
    },
    listTextStyle: {
      fontSize: 16,
      color: '#000000',
      textAlign: 'center',
      margin: 10,

    },
    modalStyle: {
      justifyContent: 'center',
      shadowRadius: 12,
      height: 30,
      width: 150,

    },
    heading: {
      fontSize: 20,
      textAlign: 'center',
      fontWeight: 'bold',
  
    }
  });
  