import React from 'react';
import { View } from 'react-native';
import  StartPage from './screens/mainscreen/index'
import  Whiteboard from './screens/whiteboardscreen/index'
import  ShareScreen from './screens/sharescreen/index'
import { GluestackUIProvider, Text } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

export default function App() {
  return (

    <GluestackUIProvider config={config}>
     <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="mainScreen" component={StartPage} />
        <Stack.Screen name="whiteBoard" component={Whiteboard} /> 
        <Stack.Screen name="shareScreen" component={ShareScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  </GluestackUIProvider>
  );
}


