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
  const [whiteboardContent, setWhiteboardContent] = useState('');
  const [whiteboardName, setWhiteboardName] = useState('');
  const [whiteboardDesc, setWhiteboardDesc] = useState('');
  const [savedWhiteboardContent, setSavedWhiteboardContent] = useState('');
  const [showPopup, setShowPopup] = useState(false);

    // INSERT data into whiteboard.db (SQLite)
    const insertData = async () => {
      return new Promise((resolve, reject) => {
        db.transaction(
          tx => {
            tx.executeSql(
              `INSERT INTO wbposts (wid, respto, title, content, created) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
              [1, 0, 'SavedWhiteBoardContent', whiteboardContent],
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


    const createWhiteboard = () => {
      if (whiteboardName!=="") {
        toggleOverlay(); 
        toggleInput();
      } else {
      alert("Innehållsfältet är tomt!");
      }
    };



  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  const toggleInput = () => {
    setShowInput(!showInput);
  };

  const saveWhiteboardContent = () => {
    setSavedWhiteboardContent(whiteboardContent);
    if (whiteboardContent!=="") {
      insertData();
      toggleInput();
      setShowPopup(true);
      console.log('Innehåll sparades:', whiteboardContent);
    } else {
      console.log('Blank innehåll. Sparades inte.')
      alert("Innehållsfältet är tomt!");
    }

  };

  const closePopup = () => {
    setShowPopup(false);
    setShowOverlay(false); 
  };

  const renderWhiteboard = () => {
    if (showInput) {
     
      return (
        <View style={Styling.whiteboardContainer}>
          <TextInput
            multiline
            placeholder="Skriv något..."
            value={whiteboardContent}
            onChangeText={text => setWhiteboardContent(text)}
            style={Styling.whiteboardInputContent}
          />
          <TouchableOpacity onPress={saveWhiteboardContent} style={Styling.saveButton}>
            <Text style={Styling.saveButtonText}>Spara</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };

  const hideKeyboard = () => {
    Keyboard.dismiss()
  };
 




  return (
    <TouchableWithoutFeedback onPress={hideKeyboard}>
    <View style={Styling.container}>
      {savedWhiteboardContent !== '' && (
        <View style={Styling.savedContentContainer}>
          <Text style={Styling.savedContentText}>Sparat whiteboard-innehåll:</Text>
          <Text style={Styling.savedContent}>{savedWhiteboardContent}</Text>
        </View>
      )}

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
              <Text style={Styling.popupText}>Din whiteboard sparades</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
    </TouchableWithoutFeedback>
  );
}
