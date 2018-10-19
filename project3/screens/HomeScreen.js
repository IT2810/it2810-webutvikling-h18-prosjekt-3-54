import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  SectionList,
  Button,
  TextInput,
  AsyncStorage,
  ListView,
  Modal,
  TouchableHighlight,
} from 'react-native';
import t from 'tcomb-form-native';
import { Header } from 'react-navigation';

//skjemaet man fyller ut for å lage en todo har slik struktur
const Form = t.form.Form;
const todo = t.struct({
  title: t.String,
  todo: t.maybe(t.String),
});
const options = {
  fields: {
    title: {
      error: 'Please enter a valid title.'
    },
    todo: {
      error: 'Please enter what to do in text.'
    }
  },
};


export default class HomeScreen extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false, //denne staten bestemmer om skjemaet man fyller ut skal vises eller ikke
      Todos: [], //todos hentes herfra og vises i FlatListen
  
    };
  }

  

  componentDidMount() {
    this.props.navigation.setParams({ handleCreateNewTodo: this._createNewTodo });
    this.props.navigation.setParams({ handleDeleteAll: this._deleteAll });
    this.fetchData(); //oppdatere FlatListen når man åpner denne komponenten
  }

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state;
    return {
      title: "", //ingen tittel i header, bruker heller <Text> field med litt stor størrelse, i render
      
      //knapp for å lage ny todo
      headerRight:<Button
                    onPress={() => params.handleCreateNewTodo()}
                    title="New Todo"
                    color="#33b2ff"
                    accessibilityLabel="Click to create a new Todo."
                  />
                  ,
      //knapp for å slette alle todos lagret på devicen i AsyncStorage.
      headerLeft:<Button
                    onPress={() => params.handleDeleteAll()}
                    title="Delete all"
                    color="#33b2ff"
                    accessibilityLabel="Click to delete all Todos."
                    />,
      
    }
  }
  
  //Metode for å endre staten til sjemaets visning
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _createNewTodo = () => {
    this.setModalVisible(true);
  }


  //metode for å slette alle todos lagret på devicen i AsyncStorage
  _deleteAll = async () => {
    try {
      let keys = await AsyncStorage.getAllKeys()
        .then((ks) => {
          ks.forEach((k) => {
            AsyncStorage.getItem(k)
            .then((v) => {
              let value = JSON.parse(v);
              if(value.identifikator === 'todo') { //vil bare slette keys merket med 'todo'
                let key = value.title;
                AsyncStorage.removeItem(key);
              }
            });
          });
        });
        
      } catch (error) {
      console.log("error consoleTest");
    }
    this.setState({Todos: []}); //oppdaterer staten til lista med todos for å vise slettingen umiddelbart
  }

  _handleCancelSave = () => {
    this.setModalVisible(!this.state.modalVisible);
  }

  //metode for å lage ny todo 
  _handleAddTodo = async () => {
    const value = this._form.getValue();
    let newTitle = value['title'];
    let newText = value['todo'];
    let newTodo = {identifikator: 'todo', title: newTitle, todo: newText}; //slik blir den lagret
    try {
      await AsyncStorage.setItem(newTitle, JSON.stringify(newTodo));
      this.setModalVisible(!this.state.modalVisible);
    } catch (error) {
      console.log("error saving Todo");
    }
    this.fetchData(); //fetchData kjøres for å oppdatere staten til Todos slik at den nylagde todoen vises umiddelbart
  }

  //metode for å hente alle todos som er lagret på devicen i AsyncStorage
  fetchData = async () => {
    let todos = []
    try {
      let keys = await AsyncStorage.getAllKeys()
        .then((ks) => {
          console.log("all keys = " + ks);
          ks.forEach((k) => {
            AsyncStorage.getItem(k)
            .then((v) => {
              let value = JSON.parse(v);
              
              if(value.identifikator === 'todo') { //vil bare hente ut keys merket med 'todo'
                let todo = {'title': value.title, 'todo' : value.todo}
                todos.push(todo);
                this.setState({Todos: todos});
                
              }
            });
          });
        });
        
      } catch (error) {
      console.log("error consoleTest");
    }
  }
  

  render() {
    return (
      <View style = {styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}>
          <View style = {styles.modalContainer}>

            <Form type={todo}
              ref={c => this._form = c}
              options={options} />
            <Button
              title = "Cancel"
              onPress = {this._handleCancelSave}
              style = {styles.cancelButton}
            />
            <Button
              title="Add"
              onPress={this._handleAddTodo}
              style = {styles.addButton}
            />
          </View>
        </Modal>
        <Text style={styles.heading}>TODOs</Text>
        <FlatList
        data={this.state.Todos}
        keyExtractor={(x, i) => i}
        renderItem={({item}) => 
        <Text style={styles.listTextStyle}>Do this: {item.title}, {item.todo}</Text>}
      />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    padding: 10      
  },
  modalContainer: {
    padding: 20,
    marginTop: Header.HEIGHT,
  },
  listTextStyle: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    margin: 10,
  },
  heading: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});
