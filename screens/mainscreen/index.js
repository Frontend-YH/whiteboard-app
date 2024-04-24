import { ScrollView,View, Image, Text, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import Styles from "./styles";
import BackgroundModal from './BackgroundModal'; 
import ThemeSelector from './../../ThemeSelector'; 
import { useNavigation } from '@react-navigation/native';


export default function StartPage({selectedBackground}) {


    const navigation = useNavigation();
    const handleButtonPress = () => {
        navigation.navigate('whiteBoard');

      };

  
      

    const [showModal, setShowModal] = useState(false);
    const handleBackgroundSelect = (background) => {
      ThemeSelector(background);
      console.log('Vald bakgrund:', background);
      setShowModal(false);
    };

  return (
    <ScrollView style={{alignContent:'center'}}>
    <View style={Styles.imageContainer}>
      <Image
         source={selectedBackground ? selectedBackground : require('./../../assets/images/cover-img.jpg')}
        style={Styles.image}
      />
    </View>
    <View style={Styles.contentContainer}>
      <Text style={Styles.heading}> Makes life easy </Text>
      <Text style={Styles.paragraf}>Oavsett om det är i klassrummet, på kontoret eller i hemmet, ger Whiteboard dig verktygen för att fånga, organisera och dela dina tankar på ett ögonblick. Låt oss tillsammans skapa och utforska i en värld av oändliga möjligheter med Whiteboard-appen. </Text>
      <TouchableOpacity style={Styles.button} onPress={handleButtonPress}>
        <Text style={Styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity >
    <View style={Styles.contentContainer}>
   
    </View>
    </TouchableOpacity>
   </ScrollView>
  );
}


// <ScrollView style={{alignContent:'center'}}></ScrollView>
