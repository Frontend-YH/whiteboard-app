import { View, Image, Text, TouchableOpacity,Modal, TouchableWithoutFeedback, Pressable} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import Styles from "./styles";
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

import { useTheme } from '../../ThemeContext';

// Any name works - free choice - picked whiteboard.db
const db = SQLite.openDatabase('whiteboard.db');

// SQLite functions below have all been fully tested and can be used.

export default function StartPage() {
  const [showModal, setShowModal] = useState(false);
  // Initialize the state to store your data
  const [data, setData] = useState([]);


// DELETE THE ENTIRE wbboards TABLE (only used for testing purposes)
const deleteWbBoardsTable = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `DROP TABLE IF EXISTS wbboards`,
          [],
          (_, result) => {
            console.log("wbboards table deleted: ", result);
            resolve(result);
          },
          (_, error) => {
            console.log("Error deleting wbboards table: ", error);
            reject(error);
          }
        );
      },
      (error) => {
        console.error("Transaction error:", error);
        reject(error);
      }
    );
  });
};

// DELETE THE ENTIRE wbposts TABLE (only used for testing purposes)
const deleteWbPostsTable = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `DROP TABLE IF EXISTS wbposts`,
          [],
          (_, result) => {
            console.log("wbposts table deleted: ", result);
            resolve(result);
          },
          (_, error) => {
            console.log("Error deleting wbposts table: ", error);
            reject(error);
          }
        );
      },
      (error) => {
        console.error("Transaction error:", error);
        reject(error);
      }
    );
  });
};

//deleteWbBoardsTable();
//deleteWbPostsTable();



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

 // INSERT data into whiteboard.db (SQLite)
 // closed now
  const insertData = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `INSERT INTO wbposts (wid, bkey, respto, title, content, created) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [1, 'AAAAAAAA', 0, 'Test title', 'Test content'],
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
  //fetchTableData();

  // SELECT data FROM whiteboard.db (SQLite)
  const fetchTableData2 = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `SELECT * FROM wbboards`,
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
  
  //fetchTableData2();



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
              <Text style={Styles.modalHeading}>Themes</Text>
              <View style={Styles.themeList}>
                {Object.keys(themes).map(theme => (
                  <TouchableOpacity key={theme} style={Styles.themeItemContainer} onPress={() => setSelectedTheme(theme)} >
                    <Text style={Styles.themeItem}>{theme}</Text>
                    {selectedTheme === theme && <Text style={Styles.themeItem}>X</Text>}
                  </TouchableOpacity>
                ))}
              </View>
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
    
     
        

     
      
   </ScrollView>
  );
}

