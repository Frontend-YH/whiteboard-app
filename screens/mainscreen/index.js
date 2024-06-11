import { View, Image, Text, TouchableOpacity,Modal, TouchableWithoutFeedback, Pressable} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import Styles from "./styles";
import { useNavigation } from '@react-navigation/native'; 
import * as SQLite from 'expo-sqlite';
import BrushIcon from './../../assets/images/brush-icon.webp';
import { useTheme } from '../../ThemeContext';

const db = SQLite.openDatabase('whiteboard.db');

export default function StartPage() {
  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState([]);


  // CREATE TABLE in whiteboard.db (SQLite)
  const createTable = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS wbposts (
              pid INTEGER PRIMARY KEY AUTOINCREMENT,
              wid INTEGER,
              bkey VARCHAR(255),
              respto INTEGER,
              title VARCHAR,
              content TEXT,
              currenttime VARCHAR(19),
              image BLOB,
              imgurl VARCHAR(255),
              data TEXT,
              style TINYINT,
              coordinates VARCHAR(255),
              created DATETIME DEFAULT CURRENT_TIMESTAMP,
              changed DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            [],
            (_, result) => {
              resolve(result);
            },
            (_, error) => {
              reject(error);
            }
          );
        },
        error => {
          console.error('Transaction error:', error);
        }
      );
    });
  };

  createTable();

  // SELECT data FROM whiteboard.db (SQLite)
  const fetchTableData = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `SELECT * FROM wbposts`,
            [],
            (_, { rows }) => {
              //console.log("xTEST: ", rows);
              resolve(rows._array);
              console.log("RArr:", rows._array);
            },
            (_, error) => {
              reject(error);
            }
          );
        },
        error => {
          console.error('Transaction error:', error);
        }
      );
    });
  };


    const navigation = useNavigation();
    const handleButtonPress = () => {
        navigation.navigate('whiteBoard');
      };




      const fetchAndLogTableData = async () => {
        try {
          const fetchedData = await fetchTableData();
          setData(fetchedData); 
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        // The screen is focused
        console.log('Screen focused');
        // Perform actions like state updates or API calls
        fetchAndLogTableData();
      });
    
      return unsubscribe;
    }, [navigation]);

    const loadData = () => {
      fetchAndLogTableData();
    };
    const { selectedTheme, setSelectedTheme } = useTheme();
    const themes = {
      'Default theme': require('./../../assets/images/cover-img.jpg'),
      'Beer theme': require('./../../assets/images/beer-background.jpg'),
      'Sport theme': require('./../../assets/images/sport-background.jpg'),
      'Fashion theme': require('./../../assets/images/fashion-background.jpg'),
      'Future theme': require('./../../assets/images/future-background.jpg'),
      'Vacation theme': require('./../../assets/images/vacation-background.jpg'),
      'Office theme': require('./../../assets/images/office-background.jpg'),
    };
    const handleThemeSelectorPress = () => {
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
    };

    const handleThemeSelect = (theme) => {
      setSelectedTheme(theme);
      setShowModal(false);
    };
  return (
    <ScrollView style={{alignContent:'center'}}>
      <View style={Styles.imageContainer}>
        <Image
          source={selectedTheme ? themes[selectedTheme] : themes['Default theme']}
          style={Styles.themeImage}
        />
        
      </View>
      <View style={Styles.contentContainer}>
        <Text style={Styles.heading}> Makes life easy </Text>
        <Text style={Styles.paragraf}>Whether it's in the classroom, office or living room, Whiteboard gives you the tools to capture, organize, and share your thoughts in an instant. Let's create and explore together in a world of endless possibilities with the Whiteboard app.</Text>
        <TouchableOpacity style={Styles.button} onPress={handleButtonPress}>
          <Text style={Styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <View style={Styles.contentFiller}>
          <Text style={Styles.heading}></Text>
        </View>
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={Styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={Styles.modalContainer}>
                <Text style={Styles.modalHeading}>Themes</Text>
                <View style={Styles.themeList}>
                  {Object.keys(themes).map(theme => (
                    <TouchableOpacity key={theme} style={Styles.themeItemContainer} onPress={() => handleThemeSelect(theme)}>
                      <Text style={Styles.themeItem}>{theme}</Text>
                      {selectedTheme === theme && <Text style={Styles.checkMark}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <TouchableOpacity style={Styles.themeSelector} onPress={handleThemeSelectorPress}>
          <Image source={BrushIcon} style={Styles.iconImage} />
        </TouchableOpacity>
    </ScrollView>
  );
}