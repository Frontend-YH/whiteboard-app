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
  const [savedWhiteboardContent, setSavedWhiteboardContent] = useState('');
  const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
     
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

    console.log("BU", whiteboardContent);
    insertData();

    }, [savedWhiteboardContent]); // The empty array means this effect runs only once after the initial render
  

    useEffect(() => {
     
        

    }, [savedWhiteboardContent]); // The empty array means this effect runs only once after the initial render
  
    



  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  const toggleInput = () => {
    setShowInput(!showInput);
  };

  const saveWhiteboardContent = () => {
    setSavedWhiteboardContent(whiteboardContent);
    toggleInput();
    setShowPopup(true);
    console.log('Innehåll sparades:', whiteboardContent);
  };

  const closePopup = () => {
    setShowPopup(false);
    setShowOverlay(false); 
  };

  const renderWhiteboard = () => {
    if (showInput) {
      Keyboard.dismiss()
      return (
        <View style={Styling.whiteboardContainer}>
          <TextInput
            multiline
            placeholder="Skriv något..."
            value={whiteboardContent}
            onChangeText={text => setWhiteboardContent(text)}
            style={Styling.whiteboardInput}
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

  return (
    <View style={Styling.container}>
      {savedWhiteboardContent !== '' && (
        <View style={Styling.savedContentContainer}>
          <Text style={Styling.savedContentText}>Sparat whiteboard-innehåll:</Text>
          <Text style={Styling.savedContent}>{savedWhiteboardContent}</Text>
        </View>
      )}

      {!showInput && (
        <TouchableOpacity style={Styling.plusButton} onPress={toggleOverlay}>
          <Text style={Styling.plusButtonText}>+</Text>
        </TouchableOpacity>
      )}

      {showOverlay && (
        <View style={Styling.overlayContainer}>
          <View style={Styling.overlay}>
            <Text style={Styling.overlayText}>Skapa en ny whiteboard</Text>
            <TouchableOpacity onPress={() => {toggleOverlay(); toggleInput();}} style={Styling.createButton}>
              <Text style={Styling.createButtonText}>Skapa</Text>
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
  );
}
