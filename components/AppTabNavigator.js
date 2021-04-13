import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import AnswerQuestionsScreen from '../screens/AnswerQuestionsScreen';
import AskQuestionScreen from '../screens/AskQuestionScreen';



export const AppTabNavigator = createBottomTabNavigator({
  AskQuestions: {
    screen: AskQuestionScreen,
    navigationOptions :{
      tabBarLabel : "Ask Question",
    }
  },
  AnswerQuestions : {
    screen: AnswerQuestionsScreen,
    navigationOptions :{
      tabBarLabel : "Answer Questions",
    }
  }
});