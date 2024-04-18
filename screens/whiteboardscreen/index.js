import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Styling from "./styles";

import * as SQLite from 'expo-sqlite';


// Any name works - free choice - picked whiteboard.db
const db = SQLite.openDatabase('whiteboard.db');

export default function Whiteboard() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showBoards, setShowBoards] = useState(true);

  const [whiteboards, setWhiteboards] = useState([]);
  
  const [whiteboardPostWid, setWhiteboardPostWid] = useState(0);
  const [whiteboardWid, setWhiteboardWid] = useState(0);
  const [whiteboardContent, setWhiteboardContent] = useState('');
  const [whiteboardName, setWhiteboardName] = useState('');
  const [whiteboardDesc, setWhiteboardDesc] = useState('');

  const [openWhiteboardPostWid, setOpenWhiteboardPostWid] = useState(0);
  const [openWhiteboardWid, setOpenWhiteboardWid] = useState(0);
  const [openWhiteboardContent, setOpenWhiteboardContent] = useState('');
  const [openWhiteboardName, setOpenWhiteboardName] = useState('');
  const [openWhiteboardDesc, setOpenWhiteboardDesc] = useState('');

  const [savedWhiteboardContent, setSavedWhiteboardContent] = useState('');

  const [showPopup, setShowPopup] = useState(false);

  const [contents, setContents] = useState({});
    
  const fetchContents = async () => {
    const contentUpdates = {};
    for (let board of whiteboards) {
      const content = await getWhiteboardContent(board.wid);
      contentUpdates[board.wid] = content;
    }
    setContents(contentUpdates);
  };

  useEffect(() => {
    fetchContents();
  }, [whiteboards]); // Only refetch when whiteboards array changes



  const createWbBoardsTable = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS wbboards (
              wid INTEGER PRIMARY KEY AUTOINCREMENT,
              key VARCHAR(255),
              qr_code TEXT,
              name VARCHAR(255),
              desc TEXT,
              theme TINYINT,
              created DATETIME DEFAULT CURRENT_TIMESTAMP
          )`,
            [],
            (_, result) => {
              console.log("Board created: ", result)
              resolve(result);
            },
            (_, error) => {
              console.log("Board creation error: ", result)
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




  const createWbPostsTable = async () => {
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
              console.log("Board (posts) created: ", result)
              resolve(result);
            },
            (_, error) => {
              console.log("Board (posts) creation error: ", result)
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



    // INSERT data into whiteboard.db (SQLite)
    const insertData = async (wid) => {
      return new Promise((resolve, reject) => {
        db.transaction(
          tx => {
            tx.executeSql(
              `INSERT INTO wbposts (wid, respto, title, content, created) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
              [wid, 0, openWhiteboardName, openWhiteboardContent],
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

    // useEffect(() => {
    //   //console.log("BU", whiteboardContent);
    //   insertData();
    // }, [savedWhiteboardContent]); // Depend on savedWhiteboardContent



  const toggleBoards = () => {
    setShowBoards(!showBoards);
  };

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
    setShowBoards(!showBoards);
  };

  const toggleInput = () => {
    setShowInput(!showInput);
  };

  const saveWhiteboardContent = () => {

    setSavedWhiteboardContent(openWhiteboardContent);

    if (openWhiteboardContent!=="") {

      let newRowId = 0;  // This variable will hold the wid of the newly inserted row

      // IF YOU CREATED A NEW BOARD
      if (openWhiteboardWid===0) {

        db.transaction(tx => {
          
          tx.executeSql(
              `INSERT INTO wbboards (key, qr_code, name, desc, theme) VALUES (?, ?, ?, ?, ?)`,
              ['exampleKey', 'ExampleQRCodeData', openWhiteboardName, openWhiteboardDesc, 1],
              (tx, results) => {
                  console.log('Insert successful, new row id:', results.insertId);
                  newRowId = results.insertId;  
                  insertData(newRowId);
              },
              (tx, error) => {
                  console.error('Error inserting new row:', error);
              }
          );
          }, (error) => {
              console.error('Transaction error:', error);
          }, () => {
              console.log('Transaction completed');
              console.log('XXX The ID of the newly inserted row is:', newRowId); 
              
          });
            
        

     } else {
      // IF IT IS AN ALREADY EXISTING BOARD
       updateData(openWhiteboardPostWid, openWhiteboardName, openWhiteboardContent);
     }



      // toggleInput();
      setShowPopup(true);
      console.log('Innehåll sparades:', whiteboardContent);
    } else {
      console.log('Blank innehåll. Sparades inte.')
      alert("Innehållsfältet är tomt!");
    }

  };


  const backToWhiteboards = () => {

    setShowOverlay(false);
    setShowInput(false);
    setShowBoards(true);

  };




  // SELECT data FROM whiteboard.db (SQLite)
  const fetchBoardPosts = async () => {
    //console.log("JONAS:", wid)
    return new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `SELECT pid, wid, title, content FROM wbposts`,
            [],
            (_, { rows }) => {
              //console.log("HELA:", rows);
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
  

  const closePopup = () => {
    setShowPopup(false);
    setShowOverlay(false); 
  };

  const renderWhiteboard = () => {
    if (showInput) {
     
      return (
        <View style={Styling.whiteboardContainer}>
          <Text style={Styling.openWhiteboardName}>{openWhiteboardName}</Text>
          <TextInput
            multiline
            placeholder="Write something..."
            defaultValue={openWhiteboardContent}
            onChangeText={text => setOpenWhiteboardContent(text)}
            style={Styling.whiteboardInputContent}
          />
          <View>
          <TouchableOpacity onPress={saveWhiteboardContent} style={Styling.saveButton}>
            <Text style={Styling.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={backToWhiteboards} style={Styling.backButton}>
            <Text style={Styling.saveButtonText}>&larr; Whiteboards</Text>
          </TouchableOpacity>
          </View>

        </View>
      );
    } else {
      return null;
    }
  };

  const hideKeyboard = () => {
    Keyboard.dismiss()
  };
 
  useEffect(() => {

    createWbBoardsTable();
    createWbPostsTable();

    db.transaction(tx => {
      tx.executeSql(
        'SELECT wid, key, qr_code, name, desc, theme, created FROM wbboards',
        [],
        (_, { rows }) => {
          console.log("SELECT: ", rows._array);
          setWhiteboards(rows._array);
        },
        (_, error) => {
          console.error('Error fetching whiteboards:', error);
        }
      );
    });
  }, []);


  const createWhiteboard = () => {

    if (whiteboardName!=="") {
      
      setOpenWhiteboardWid(0);
      setOpenWhiteboardPostWid(0);
      setOpenWhiteboardName(whiteboardName);
      setOpenWhiteboardContent("");
      setOpenWhiteboardDesc(whiteboardDesc);
      toggleOverlay(); 
      toggleInput();
      setShowBoards(false);

    } else {
    alert("Innehållsfältet är tomt!");
    }
  };

  // OPEN A SPECIFIC WHITEBOARD
  const openWhiteboard  = async (wid) => {
    
 
      //console.log("WID:", wid);
      const fetchedData = await fetchBoardPosts();
      console.log("minX:", fetchedData);
      console.log("minWID:", fetchedData[0].wid);
      //console.log("Current Data WID:", fetchedData);
      let boardData = fetchedData.filter(post => parseInt(post.wid) === parseInt(wid));

      console.log("Empty:", boardData);

      //console.log("CLOG:",boardData);

      setOpenWhiteboardWid(boardData[0].wid); 
      setOpenWhiteboardPostWid(boardData[0].pid); 
      setOpenWhiteboardName(boardData[0].title); 
      setOpenWhiteboardDesc(""); 
      setOpenWhiteboardContent(boardData[0].content); 
      console.log("HK:", boardData[0].content);
      
      //console.log("CONTENT: ", fetchedData[0].content);
      //toggleOverlay(); 
      //toggleInput();
      setShowInput(true);
      setShowBoards(false);

      //console.log(fetchedData);

   
  };
 


    // OPEN A SPECIFIC WHITEBOARD
    const getWhiteboardContent  = async (wid) => {
    
      const fetchedData = await fetchBoardPosts();
      console.log("minX:", fetchedData);
      console.log("minWID:", fetchedData[0].wid);
      //console.log("Current Data WID:", fetchedData);
      let boardData = fetchedData.filter(post => parseInt(post.wid) === parseInt(wid));

      return boardData[0].content; 

  };

  useEffect(() => {
    // Code here will run when the component mounts
    console.log('Component has mounted');
    // You can also load data or perform other side effects here

    return () => {
      // This function will run when the component unmounts
      console.log('Component will unmount');
    };
  }, []); // The empty array means this effect runs only once after the initial render

  return (
    <TouchableWithoutFeedback onPress={hideKeyboard}>
    <View style={Styling.container}>
   
    {showBoards && whiteboards.map((whiteboard, index) => (
      <TouchableWithoutFeedback key={index} onPress={() => openWhiteboard(whiteboard.wid)}>
        <View>
        <Text style={Styling.openWhiteboardSmallName}>{whiteboard.name}</Text>
        <Text style={Styling.overlayDescText}>{whiteboard.desc}</Text>
        <View style={Styling.overlayContainer}>
          <View style={Styling.overlay}>
            <Text style={Styling.overlayBoardText}>{contents[whiteboard.wid]}</Text>
          </View>
        </View>
        </View>
        </TouchableWithoutFeedback>
      ))}

      {!showInput && (
        <TouchableOpacity style={Styling.plusButton} onPress={() => {toggleOverlay(); }}>
          <Text style={Styling.plusButtonText}>+</Text>
        </TouchableOpacity>
      )}

       {showOverlay && (
        <View style={Styling.overlayContainer}>
          <View style={Styling.overlay}>
            <Text style={Styling.overlayText}>New Whiteboard</Text>
            <TextInput
            placeholder="whiteboard name"
            value={whiteboardName}
            onChangeText={value => setWhiteboardName(value)}
            style={Styling.whiteboardInputName} placeholderTextColor="#999"
          />
            <TextInput
            placeholder="whiteboard description"
            multiline
            value={whiteboardDesc}
            onChangeText={value => setWhiteboardDesc(value)}
            style={Styling.whiteboardInputDesc} placeholderTextColor="#999"
          />
            <TouchableOpacity onPress={createWhiteboard} style={Styling.createButton}>
              <Text style={Styling.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      )} 

      {renderWhiteboard()}

      <Modal visible={showPopup} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={closePopup}>
          <View style={Styling.modalContainer}>
            <View style={Styling.popup}>
              <FontAwesome name="check" size={40} color="green" />
              <Text style={Styling.popupText}>Whiteboard saved</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
    </TouchableWithoutFeedback>
  );
}
