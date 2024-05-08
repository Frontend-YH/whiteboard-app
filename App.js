import { View } from 'react-native';
import React from 'react';
import  StartPage from './screens/mainscreen/index'
import  Whiteboard from './screens/whiteboardscreen/index'
import  ShareScreen from './screens/sharescreen/index'
import { GluestackUIProvider, Text } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import { ThemeProvider } from './ThemeContext'; 



// SQLite for React Native Expo
// db.transaction(tx => {
//     tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS wbposts (
//             pid INTEGER PRIMARY KEY AUTOINCREMENT,
//             wid INTEGER,
//             respto INTEGER,
//             title VARCHAR,
//             content TEXT,
//             image BLOB,
//             imgurl VARCHAR(255),
//             data TEXT,
//             style TINYINT,
//             coordinates VARCHAR(255),
//             created DATETIME DEFAULT CURRENT_TIMESTAMP,
//             changed DATETIME DEFAULT CURRENT_TIMESTAMP
//         )`
//       );
//       tx.executeSql(
//         `INSERT INTO wbposts (wid, respto, title, content, created) VALUES (1, 0, "Test title", "Test content");`
//       );

// });



const Stack = createStackNavigator();


export default function App() {
  return (
    <ThemeProvider>
    <GluestackUIProvider config={config}>
     <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="mainScreen" component={StartPage} />
        <Stack.Screen name="whiteBoard" component={Whiteboard} /> 
        <Stack.Screen name="shareScreen" component={ShareScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  </GluestackUIProvider>
  </ThemeProvider>
  );
}


