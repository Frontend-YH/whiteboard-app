import { ScrollView ,View, Image, Text, TouchableOpacity,Modal, TouchableWithoutFeedback} from 'react-native';
import { useState, useEffect } from 'react';
import Styles from "./styles";
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';


// Any name works - free choice - picked whiteboard.db
const db = SQLite.openDatabase('whiteboard.db');

// SQLite functions below have all been fully tested and can be used.

export default function StartPage() {
  const [showModal, setShowModal] = useState(false);
  // Initialize the state to store your data
  const [data, setData] = useState([]);

  // CREATE TABLE in whiteboard.db (SQLite)
  // closed now
  const createTable = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS wbposts (
              pid INTEGER PRIMARY KEY AUTOINCREMENT,
              wid INTEGER,
              respto INTEGER,
              title VARCHAR,
              content TEXT,
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

  //createTable();

 // INSERT data into whiteboard.db (SQLite)
 // closed now
  const insertData = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `INSERT INTO wbposts (wid, respto, title, content, created) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [1, 0, 'Test title', 'Test content'],
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
  //insertData();


// Update data in whiteboard.db (SQLite) where wid matches a specific value
// closed now
const updateData = async (pid, newTitle, newContent) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `UPDATE wbposts SET title = ?, content = ? WHERE pid = ?`,
          [newTitle, newContent, pid],
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
// parameters: pid, title, content
//updateData(16, "New test title 2 april nr2", "New test content 2 april nr2");
  
   // INSERT data into whiteboard.db (SQLite)
   // closed now
   const deleteData = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `DELETE FROM wbposts`,
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
  //deleteData();
 

   // INSERT data into whiteboard.db (SQLite)
   // closed now
   const deleteData2 = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `DELETE FROM wbboards`,
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
  //deleteData2();


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
          //console.log(fetchedData);
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
    const [selectedTheme, setSelectedTheme] = useState(null);
    const themes = {
      'Default theme': require('./../../assets/images/cover-img.jpg'),
      'Beer theme': require('./../../assets/images/beer-background.jpg'),
      'Sport theme': require('./../../assets/images/sport-background.jpg'),
      'Fashion theme': require('./../../assets/images/fashion-background.jpg'),
      'Future theme': require('./../../assets/images/future-background.jpg'),
    };
    const handleThemeSelectorPress = () => {
      console.log("hej")
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
    };


  return (
    <ScrollView style={{alignContent:'center'}}>
    <View style={Styles.imageContainer}>
    <Image
          source={selectedTheme ? themes[selectedTheme] : themes['Default theme']}
          style={Styles.image}
        />
    </View>
    <View style={Styles.contentContainer}>
      <Text style={Styles.heading}> Makes life easy </Text>
      <Text style={Styles.paragraf}>Whether it's in the classroom, office or living room, Whiteboard gives you the tools to capture, organize, and share your thoughts in an instant. Let's create and explore together in a world of endless possibilities with the Whiteboard app.</Text>
      <TouchableOpacity style={Styles.button} onPress={handleButtonPress}>
        <Text style={Styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
    {/* <TouchableOpacity onPress={loadData}>
    <View style={Styles.contentContainer}>
    {data.map((item, index) => (
    <View key={index}>
      <Text style={Styles.heading}>{item.title}</Text>
      <Text style={Styles.paragraf}>{item.content}</Text>
    </View>
  ))}
    </View>
    </TouchableOpacity> */}
      <TouchableOpacity  style={Styles.themeSelector} onPress={handleThemeSelectorPress}>
      <FontAwesome
  name="cog"
  size={24}
  color="black"
/>
  </TouchableOpacity>
  <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
      >
       <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={Styles.modalBackground}>
            <View style={Styles.modalContainer}>
              <Text style={Styles.modalHeading}>Välj tema</Text>
              <View style={Styles.themeList}>
                {Object.keys(themes).map(theme => (
                  <TouchableOpacity key={theme} style={Styles.themeItemContainer} onPress={() => setSelectedTheme(theme)}>
                    <Text style={Styles.themeItem}>{theme}</Text>
                    {selectedTheme === theme && <FontAwesome name="check" size={20} color="green" style={Styles.checkIcon} />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
   </ScrollView>
  );
}


// <ScrollView style={{alignContent:'center'}}></ScrollView>