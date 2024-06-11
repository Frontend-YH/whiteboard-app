import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
 
} from "react-native";

import Styling from "./styles";
import * as SQLite from "expo-sqlite";
import { useTheme } from "../../ThemeContext";

const themes = {
  "Default theme": require("./../../assets/images/cover-img.jpg"),
  "Beer theme": require("./../../assets/images/beer-background.jpg"),
  "Sport theme": require("./../../assets/images/sport-background.jpg"),
  "Fashion theme": require("./../../assets/images/fashion-background.jpg"),
  "Future theme": require("./../../assets/images/future-background.jpg"),
  "Vacation theme": require("./../../assets/images/vacation-background.jpg"),
  "Office theme": require("./../../assets/images/office-background.jpg"),
};
const db = SQLite.openDatabase("whiteboard.db");

// ######## Connect to nodeJS server to sync data between devices ##########################
const postData = async (title, content, wid, bkey, currentTime) => {

  try {
    const response = await fetch('http://tserv.se:3001/whiteboard/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: title, content: content, wid: wid, bkey: bkey, currentTime: currentTime  }),
    });
    const data = await response.json();
 
    return data;
  } catch (error) {
    console.error('ErrorX posting data:', error);
  }


};

// ######## Connect to nodeJS server to sync data between devices ##########################
const syncData = async (bkey) => {

  try {
    const response = await fetch('http://tserv.se:3001/whiteboard/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bkey: bkey  }),
    });
    const data = await response.json();
   
    return data;
  } catch (error) {
    console.error('Error posting data:', error);
  }
};


// ########################################################################################

// ############## GENERATE 8 LETTERS RANDOMLY ###############################################
  function generateRandomCapitalLetters() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      result += letters[randomIndex];
    }
    return result;
  }
// #########################################################################################

// ############# GENERATE CURRENT TIME AND DATE ############################################
  const getCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
// #########################################################################################

// ############# CHECK WHICH DATE IS THE MOST RECENT #######################################
  const isLaterThan = (dateTime1, dateTime2) => {
    const dt1 = new Date(dateTime1);
    const dt2 = new Date(dateTime2);

    return dt1 > dt2;
  };

// #########################################################################################

export default function Whiteboard() {
  const { selectedTheme, setSelectedTheme } = useTheme();
  const [showOverlay, setShowOverlay] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showBoards, setShowBoards] = useState(true);
  const [whiteboards, setWhiteboards] = useState([]);
  const [whiteboardPostWid, setWhiteboardPostWid] = useState(0);
  const [whiteboardWid, setWhiteboardWid] = useState(0);
  const [whiteboardContent, setWhiteboardContent] = useState("");
  const [whiteboardName, setWhiteboardName] = useState("");
  const [whiteboardDesc, setWhiteboardDesc] = useState("");
  const [whiteboardBkey, setWhiteboardBkey] = useState("");
  const [openWhiteboardPostWid, setOpenWhiteboardPostWid] = useState(0);
  const [openWhiteboardPostBkey, setOpenWhiteboardPostBkey] = useState("");
  const [openWhiteboardWid, setOpenWhiteboardWid] = useState(0);
  const [openWhiteboardContent, setOpenWhiteboardContent] = useState("");
  const [openWhiteboardName, setOpenWhiteboardName] = useState("");
  const [openWhiteboardDesc, setOpenWhiteboardDesc] = useState("");
  const [openWhiteboardBkey, setOpenWhiteboardBkey] = useState("");
  const [openWhiteboardEditTime, setopenWhiteboardEditTime] = useState("");
  
  const [savedWhiteboardContent, setSavedWhiteboardContent] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [contents, setContents] = useState("");

  const fetchContents = async () => {
    const contentUpdates = {};
    for (let board of whiteboards) {
      const content = await getWhiteboardContent(board.wid, board.bkey);
      contentUpdates[board.wid] = content;
    }
    setContents(contentUpdates);
  };

  useEffect(() => {
    fetchContents();
  }, [whiteboards]);

  const createWbBoardsTable = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS wbboards (
              wid INTEGER PRIMARY KEY AUTOINCREMENT,
              bkey VARCHAR(255),
              qr_code TEXT,
              name VARCHAR(255),
              desc TEXT,
              theme TINYINT,
              created DATETIME DEFAULT CURRENT_TIMESTAMP
          )`,
            [],
            (_, result) => {
              console.log("Board created: ", result);
              resolve(result);
            },
            (_, error) => {
              console.log("Board creation error: ", result);
              reject(error);
            }
          );
        },
        (error) => {
          console.error("Transaction error:", error);
        }
      );
    });
  };

  const createWbPostsTable = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
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
              console.log("Board (posts) created: ", result);
              resolve(result);
            },
            (_, error) => {
              console.log("Board (posts) creation error: ", result);
              reject(error);
            }
          );
        },
        (error) => {
          console.error("Transaction error:", error);
        }
      );
    });
  };

  // INSERT data into whiteboard.db (SQLite)
  const insertData = async (wid, bkey) => {
    return new Promise((resolve, reject) => {
      const currentTime = getCurrentTime();
      console.log("CTIME: ", currentTime);
      db.transaction(
        (tx) => {
          tx.executeSql(
            `INSERT INTO wbposts (wid, bkey, respto, title, content, currenttime) VALUES (?, ?, ?, ?, ?, ?)`,
            [wid, bkey, 0, openWhiteboardName, openWhiteboardContent, currentTime],
            (_, result) => {
              resolve(result);
              // Post to nodeJS server
              postData(openWhiteboardName, openWhiteboardContent, wid, bkey, currentTime);
            },
            (_, error) => {
              reject(error);
            }
          );
        },
        (error) => {
          console.error("Transaction error:", error);
        }
      );
    });
  };

  const updateData = async (wid, bkey, newTitle, newContent, currentTime) => {

     // Post to nodeJS server
    const returned = await postData(newTitle, newContent, wid, bkey, currentTime);
    if (returned) {
      newContent = returned.content;
    } 

      return new Promise((resolve, reject) => {
        
        db.transaction(
          (tx) => {
            tx.executeSql(
              `UPDATE wbposts SET title = ?, content = ?, currenttime = ? WHERE pid = ?`,
              [newTitle, newContent, currentTime, wid],
              (_, result) => {
                resolve(result);
            
              },
              (_, error) => {
                reject(error);
              }
            );
          },
          (error) => {
            console.error("Transaction error:", error);
          }
        );


        
      });

  };
  const toggleBoards = () => {
    setShowBoards(!showBoards);
  };

  const confirmDeleteWhiteboard = (wid,event) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this whiteboard?",
      [ {
        text: "Delete",
        onPress: () => handleTrashCanPress(wid,event),
        style: "destructive",
      },
        {
          text: "Cancel",
          style: "cancel",
        },
       
      ],
      { cancelable: true }
    );
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

    if (openWhiteboardContent !== "") {
      let newRowId = 0;

      // IF YOU CREATED A NEW BOARD
      let boardKey;
      if (openWhiteboardWid === 0) {
        // If the user wants to create a new Board Key
        if (openWhiteboardBkey==="") {
          boardKey = generateRandomCapitalLetters();
        } else {
          // If the user has provided an already exisiting Board Key
          // to share Boards across devices
          boardKey = openWhiteboardBkey;
        }
        db.transaction(
          (tx) => {
            tx.executeSql(
              `INSERT INTO wbboards (bkey, qr_code, name, desc, theme) VALUES (?, ?, ?, ?, ?)`,
              [
                boardKey,
                "ExampleQRCodeData",
                openWhiteboardName,
                openWhiteboardDesc,
                1,
              ],
              (tx, results) => {
                console.log("Insert successful, new row id:", results.insertId);
                newRowId = results.insertId;
                console.log("New Board Bkey: ", boardKey);
                insertData(newRowId, boardKey);
                backToWhiteboards();
              },
              (tx, error) => {
                console.error("Error inserting new row:", error);
              }
            );
          },
          (error) => {
            console.error("Transaction error:", error);
          },
          () => {
            console.log("Transaction completed");
            console.log("XXX The ID of the newly inserted row is:", newRowId);
          }
        );
      } else {
        // IF IT IS AN ALREADY EXISTING BOARD
        console.log("oHnO: ", openWhiteboardPostBkey);
        updateData(
          openWhiteboardPostWid,
          openWhiteboardPostBkey,
          openWhiteboardName,
          openWhiteboardContent,
          openWhiteboardEditTime
        );
        backToWhiteboards();
      }
      setShowPopup(true);
      console.log("Innehåll sparades:", whiteboardContent);
    } else {
      console.log("Blank innehåll. Sparades inte.");
      alert("Innehållsfältet är tomt!");
    }
  };

  const backToWhiteboards = () => {
    // Reloads all the DB content to the whiteboard section ##############################################
    // Later put this reload-code in separate function we call when we need reload instead.
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT wid, bkey, qr_code, name, desc, theme, created FROM wbboards",
        [],
        (_, { rows }) => {
          console.log("SELECT: ", rows._array);
          setWhiteboards(rows._array);
        },
        (_, error) => {
          console.error("Error fetching whiteboards:", error);
        }
      );
    });
    // ####################################################################################################

    setShowOverlay(false);
    setShowInput(false);
    setShowBoards(true);
  };

  // SELECT data FROM whiteboard.db (SQLite)
  const fetchBoardPosts = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT pid, bkey, wid, title, content, currenttime FROM wbposts`,
            [],
            (_, { rows }) => {
              resolve(rows._array);
            },
            (_, error) => {
              reject(error);
            }
          );
        },
        (error) => {
          console.error("Transaction error:", error);
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
            onChangeText={(text) => setOpenWhiteboardContent(text)}
            style={Styling.whiteboardInputContent}
          />
          <View>
            <TouchableOpacity
              onPress={saveWhiteboardContent}
              style={Styling.saveButton}
            >
              <Text style={Styling.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={backToWhiteboards}
              style={Styling.backButton}
            >
              <Text style={Styling.saveButtonText}>&larr; Whiteboards</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };
  const handleTrashCanPress = async (wid, event) => {
    event.persist();
    console.log("Deleted whiteboard with WID:", wid);
    try {
      await deleteWhiteboardData(wid);
      console.log("Whiteboard deleted successfully");
      backToWhiteboards();
    } catch (error) {
      console.error("Error deleting whiteboard:", error);
    }
  };

  const deleteWhiteboardData = async (wid) => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `DELETE FROM wbposts WHERE wid = ?`,
            [wid],
            (_, result) => {
              tx.executeSql(
                `DELETE FROM wbboards WHERE wid = ?`,
                [wid],
                (_, result) => {
                  resolve(result);
                },
                (_, error) => {
                  reject(error);
                }
              );
            },
            (_, error) => {
              reject(error);
            }
          );
        },
        (error) => {
          console.error("Transaction error:", error);
        }
      );
    });
  };
  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    createWbBoardsTable();
    createWbPostsTable();

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT wid, bkey, qr_code, name, desc, theme, created FROM wbboards",
        [],
        (_, { rows }) => {
          console.log("SELECT: ", rows._array);
          setWhiteboards(rows._array);
        },
        (_, error) => {
          console.error("Error fetching whiteboards:", error);
        }
      );
    });
  }, []);

  const createWhiteboard = () => {
    if (whiteboardName !== "") {
      setWhiteboardName("");
      setWhiteboardDesc("");
      setWhiteboardBkey("");
      setOpenWhiteboardWid(0);
      setOpenWhiteboardPostWid(0);
      setOpenWhiteboardPostBkey("AAAAAAAA");
      setOpenWhiteboardName(whiteboardName);
      setOpenWhiteboardContent("");
      setOpenWhiteboardDesc(whiteboardDesc);
      setOpenWhiteboardBkey(whiteboardBkey);
      toggleOverlay();
      toggleInput();
      setShowBoards(false);
    } else {
      alert("Innehållsfältet är tomt!");
    }
  };

  // OPEN A SPECIFIC WHITEBOARD
  const openWhiteboard = async (wid) => {
  
    const fetchedData = await fetchBoardPosts();
    console.log("minX:", fetchedData);
    console.log("minWID:", fetchedData[0].wid);
    let boardData = fetchedData.filter(
      (post) => parseInt(post.wid) === parseInt(wid)
    );

    const serverData = await syncData(boardData[0].bkey);
    console.log("ServerDataOpenWhiteBoard: ", serverData);
    if(serverData) {
      boardData[0].title = serverData[0].title;
      boardData[0].content = serverData[0].content;
      boardData[0].bkey = serverData[0].bkey;
      boardData[0].wid = serverData[0].wid;
    }   
    

    setOpenWhiteboardWid(boardData[0].wid);
    setOpenWhiteboardPostWid(boardData[0].pid);
    setOpenWhiteboardPostBkey(boardData[0].bkey);
    setOpenWhiteboardName(boardData[0].title);
    setOpenWhiteboardDesc("");
    setOpenWhiteboardContent(boardData[0].content);
   
    setopenWhiteboardEditTime(getCurrentTime());
 
    setShowInput(true);
    setShowBoards(false);

  };

  // OPEN A SPECIFIC WHITEBOARD
  const getWhiteboardContent = async (wid, bkey) => {
  
    const fetchedData = await fetchBoardPosts();
  
    let boardData = fetchedData.filter(
      (post) => parseInt(post.wid) === parseInt(wid)
    );

    let serverData = await syncData(bkey);
    
    if(serverData) {
      boardData[0].content = serverData[0].content;
    }
    
     return boardData[0].content;
   }; 



  useEffect(() => {
    console.log("Component has mounted");
    return () => {
      console.log("Component will unmount");
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={hideKeyboard}>
      <ImageBackground
        source={themes[selectedTheme]}
        resizeMode="cover"
        style={Styling.container}
      >
        {showBoards &&
          whiteboards.map((whiteboard, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => openWhiteboard(whiteboard.wid)}
            >
              <View>
                <View style={Styling.overlayTitle}>
                  <View style={Styling.trashCanContainer}>
                    <TouchableOpacity
                      onPress={(event) =>
                        confirmDeleteWhiteboard(whiteboard.wid, event)
                      }
                      style={Styling.trashCan}
                    >
                      <Text>X</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={Styling.openWhiteboardSmallName}>
                    {whiteboard.name}
                  </Text>
                  <Text style={Styling.overlayDescText}>{whiteboard.desc}</Text>
                </View>
                <View style={Styling.overlayContainer}>
                  <View style={Styling.overlay}>
                  {contents[whiteboard.wid] ? (
                    <Text style={Styling.overlayBoardText}>
                      {contents[whiteboard.wid]}
                    </Text>
                  ) : (
                    <Image
                      source={require("./../../assets/images/loading.gif")}
                      style={Styling.overlayBoardImage} 
                    />
                  )}
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          ))}

        {!showInput && (
          <TouchableOpacity
            style={Styling.plusButton}
            onPress={() => {
              toggleOverlay();
            }}
          >
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
                onChangeText={(value) => setWhiteboardName(value)}
                style={Styling.whiteboardInputName}
                placeholderTextColor="#999"
              />
              <TextInput
                placeholder="whiteboard description"
                multiline
                value={whiteboardDesc}
                onChangeText={(value) => setWhiteboardDesc(value)}
                style={Styling.whiteboardInputDesc}
                placeholderTextColor="#999"
              />
              <TextInput
                placeholder="Board Key (leave empty to create new)"
                value={whiteboardBkey}
                onChangeText={(value) => setWhiteboardBkey(value)}
                style={Styling.whiteboardInputBkey}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={createWhiteboard}
                style={Styling.createButton}
              >
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
                <Text>X</Text>
                <Text style={Styling.popupText}>Whiteboard saved</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
