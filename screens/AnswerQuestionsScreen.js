import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { ListItem } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class answerQuestionsScreen extends Component{
  constructor(){
    super()
    this.state = {
      userId  : firebase.auth().currentUser.email,
      requestedQuestionsList : []
    }
  this.requestRef= null
  }

  getRequestedQuestionsList=async()=>{
    this.requestRef = db.collection("questions")
    .onSnapshot((snapshot)=>{
      var  requestedQuestionsLists = []
      snapshot.forEach((doc) => {
          requestedQuestionsLists.push(doc.data().question)
      })
      console.log(requestedQuestionsLists)
      this.setState({requestedQuestionsList:requestedQuestionsLists})
    })
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        description = {item}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
            <TouchableOpacity style={styles.button}
            /* onPress ={()=>{
               this.props.navigation.navigate("Answer",{"details": item})
             }}
             */>
              <Text style={{color:'#ffff'}}>Answer</Text>
            </TouchableOpacity>
          }
        bottomDivider
      />
    )
  }

  componentDidMount(){
    this.getRequestedQuestionsList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="My App" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          <Text>{console.log(this.state.requestedQuestionsLists)}</Text>
          {
            this.state.requestedQuestionsList.length === 0
            ?(
              <View style={{flex:1, fontSize: 20, justifyContent:'center', alignItems:'center'}}>
                <Text style={{ fontSize: 20}}>List of all Questions</Text>
              </View>
            )
            :(<View>
                <Text>{console.log(this.state.requestedQuestionsLists)}</Text>
              <FlatList
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                data={this.state.requestedQuestionsList}
              />
              </View>
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ffa500",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})