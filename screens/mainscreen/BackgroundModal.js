// BackgroundModal.js

import React from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BackgroundModal = ({ visible, onClose, onSelectBackground }) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Välj en bakgrund</Text>
          <TouchableOpacity onPress={() => onSelectBackground('sport')} style={styles.optionButton}>
            <Text style={styles.optionText}>Sport</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSelectBackground('beer')} style={styles.optionButton}>
            <Text style={styles.optionText}>Beer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSelectBackground('fashion')} style={styles.optionButton}>
            <Text style={styles.optionText}>fashion</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSelectBackground('future')} style={styles.optionButton}>
            <Text style={styles.optionText}>future</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={[styles.optionButton, styles.cancelButton]}>
            <Text style={styles.optionText}>Avbryt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#e3e3e3',
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'red',
  },
});

export default BackgroundModal;
