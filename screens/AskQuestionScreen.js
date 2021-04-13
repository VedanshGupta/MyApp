import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import { RFValue } from "react-native-responsive-fontsize";
import { Input } from 'react-native-elements';

export default class AskQuestionScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      question:"",
      IsQuestionRequestActive : "",
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }



  addQuestion = async (question)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('questions').add({
        "user_id": userId,
        "question":question,
        "request_id"  : randomRequestId,
    })

    await  this.getExchangeRequest()
    db.collection('users').where("email_id","==",userId).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
      IsQuestionRequestActive: true
      })
    })
  })

    this.setState({
        question :'' 
    })

    return alert("Question Requested to developer successfully. If approved, your question will be posted to the other users in the app.")
  }

  getIsQuestionRequestActive(){
    db.collection('users')
    .where('email_id','==',this.state.userId)
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.setState({
          IsQuestionRequestActive:doc.data().IsQuestionRequestActive,
          userDocId : doc.id
        })
      })
    })
  }

  sendNotification=()=>{
    //to get the first name and last name
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().first_name
        var lastName = doc.data().last_name
      })
    })
  }

  updateQuestionRequestStatus=()=>{
    //updating the question status after receiving the question
    db.collection('requested_questions').doc(this.state.docId)
    .update({
      question_status : 'recieved'
    })

    //getting the  doc id to update the users doc
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        //updating the doc
        db.collection('users').doc(doc.id).update({
          IsQuestionRequestActive: false
        })
      })
    })
  }

  receivedQuestions=(question)=>{
    var userId = this.state.userId
    var requestId = this.state.requestId
    db.collection('received_questions').add({
        "user_id": userId,
        "questio":question,
        "request_id"  : requestId,
        "questionStatus"  : "received",

    })
  }

   getQuestionRequest =()=>{
var questionRequest=  db.collection('requested_questions')
  .where('user_id','==',this.state.userId)
  .get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      if(doc.data().question_status !== "received"){
        this.setState({
          requestId : doc.data().request_id,
          requestedQuestion: doc.data().question_name,
          questionStatus:doc.data().question_status,
          docId     : doc.id
        })
      }
    })
})}

  componentDidMount(){
    this.getQuestionRequest()
    this.getIsQuestionRequestActive()
  }

  render(){

      if(this.state.IsQuestionRequestActive === true){
        return(

          // Status screen

          <View style = {{flex:1,justifyContent:'center'}}>
            <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text>Question Name</Text>
            <Text>{this.state.requestedQuestion}</Text>
            </View>
            <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text> Question Status </Text>

            <Text>{this.state.questionStatus}</Text>
            </View>

            <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
            onPress={()=>{
              this.sendNotification()
              this.updateQuestionRequestStatus();
              this.receivedQuestions(this.state.requestedQuestion)
            }}>
            <Text>The question has been recieved by the developer</Text>
            </TouchableOpacity>
          </View>
        )
      }
      else
      {
      return(
        // Form screen
          <View style={{flex:1}}>
            <MyHeader title="Ask Question" navigation ={this.props.navigation}/>

            <ScrollView>
              <KeyboardAvoidingView style={styles.keyBoardStyle}>
                <Input
                  style ={styles.formInput}
                  label={"Question"}
                  placeholder={"enter question name"}
                  onChangeText={(text)=>{
                      this.setState({
                          question:text
                      })
                  }}
                  value={this.state.question}
                />
                {this.state.showFlatList ? 
                  (<Flatlist
                  data={this.state.dataSource}
                  renderItem={this.renderItem}
                  enableEmptySections={true}
                  style={{marginTop:10}}
                  keyExtractor={(item, index)=>index.toString()}
                  />)
                  : (<View style={{alignItems: 'center'}}>
                      
                      <TouchableOpacity
                        style={styles.button}
                        onPress={()=>{ this.addQuestion(this.state.question);
                        }}
                        >
                        <Text>Request</Text>
                      </TouchableOpacity>
                     </View>)
                }

              </KeyboardAvoidingView>
              </ScrollView>
          </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formInput:{
    width:"75%",
    height:RFValue(15),
    alignSelf:'center',
    borderColor:'#ffab91',
    borderBottomWidth:1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  button:{
    width:"100%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ffa500",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)