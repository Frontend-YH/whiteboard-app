import { ScrollView,View, Image, Text, TouchableOpacity } from 'react-native';
import Styles from "./styles";
import { useNavigation } from '@react-navigation/native';

export default function StartPage() {
    const navigation = useNavigation();
    const handleButtonPress = () => {
        navigation.navigate('whiteBoard');

      };
  return (
    <ScrollView style={{alignContent:'center'}}>
    <View style={Styles.imageContainer}>
      <Image
        source={require('./../../assets/images/cover-img.jpg')}
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
  </ScrollView>
  );
}
