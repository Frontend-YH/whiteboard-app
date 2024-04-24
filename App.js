import { View, Image,TouchableOpacity } from 'react-native';
import React , { useState}   from 'react';
import  StartPage from './screens/mainscreen/index'
import  Whiteboard from './screens/whiteboardscreen/index'
import  ShareScreen from './screens/sharescreen/index'
import BackgroundModal from './screens/mainscreen/BackgroundModal';
import { GluestackUIProvider, Text } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import ThemeSelector from './ThemeSelector';


const Stack = createStackNavigator();
export default function App() {
const [backgroundStyle, setBackgroundStyle] = useState({});
const [showModal, setShowModal] = useState(false);

const handleThemeChange = (theme) => {
  console.log("theme",theme)
  console.log("dafuq",ThemeSelector.applyTheme(theme))
  const themeStyles = ThemeSelector.applyTheme(theme);
  console.log(themeStyles.backgroundImage,"här");
  setBackgroundStyle(themeStyles);
 
  setSelectedBackground(theme); 
  
};
const [selectedBackground, setSelectedBackground] = useState(null);

  return (

    <GluestackUIProvider config={config}>
     <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="mainScreen">
  {() => <StartPage selectedBackground={selectedBackground} />}
</Stack.Screen>
        <Stack.Screen name="whiteBoard" component={Whiteboard} /> 
        <Stack.Screen name="shareScreen" component={ShareScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <FontAwesome name="paint-brush" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <BackgroundModal visible={showModal} onClose={() => setShowModal(false)} onSelectBackground={handleThemeChange} />
    </GluestackUIProvider>
  );
}


