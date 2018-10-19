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
      modalVisible: false,
      Todos: [],
      appointments: [],
  
    };
  }

  

  componentDidMount() {
    this.props.navigation.setParams({ handleCreateNewTodo: this._createNewTodo });
    this.props.navigation.setParams({ handleDeleteAll: this._deleteAll });
    this.fetchData();
  }

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state;
    return {
      title: "",
      
      headerRight:<Button
                    onPress={() => params.handleCreateNewTodo()}
                    title="New Todo"
                    color="#33b2ff"
                    accessibilityLabel="Click to create a new Todo."
                  />
                  ,
      headerLeft:<Button
                    onPress={() => params.handleDeleteAll()}
                    title="Delete all"
                    color="#33b2ff"
                    accessibilityLabel="Click to delete all Todos."
                    />,
      
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _createNewTodo = () => {
    this.setModalVisible(true);
  }



  _deleteAll = async () => {
    try {
      let keys = await AsyncStorage.getAllKeys()
        .then((ks) => {
          ks.forEach((k) => {
            AsyncStorage.getItem(k)
            .then((v) => {
              let value = JSON.parse(v);
              if(value.identifikator === 'todo') {
                let key = value.title;
                AsyncStorage.removeItem(key);          
                console.log(key);
                
                
              }
            });
          });
        });
        
      } catch (error) {
      console.log("error consoleTest");
    }
    this.setState({Todos: []});
  }

  _handleCancelSave = () => {
    this.setModalVisible(!this.state.modalVisible);
  }

  _handleAddTodo = async () => {
    const value = this._form.getValue();
    let newTitle = value['title'];
    let newText = value['todo'];
    let newTodo = {identifikator: 'todo', title: newTitle, todo: newText};
    try {
      await AsyncStorage.setItem(newTitle, JSON.stringify(newTodo));
      this.setModalVisible(!this.state.modalVisible);
    } catch (error) {
      console.log("error saving Todo");
    }
    this.fetchData();
  }

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
              
              if(value.identifikator === 'todo') {
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
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
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
