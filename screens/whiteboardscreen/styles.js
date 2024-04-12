import { StyleSheet, Dimensions} from 'react-native';
var width = Dimensions.get('window').width; 
const Styling = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  plusButton: {
    position: 'absolute',
    bottom: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButtonText: {
    color: 'white',
    fontSize: 24,
  },
  overlayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 240, 0.1)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',  // Shadow color: black for a subtle look
    shadowOffset: { width: 0, height: 2 },  // Small shadow offset for a gentle lift effect

    borderWidth: 6,
    borderColor: '#e0e0e0',
  },
  overlayText: {
    color: 'black',
    fontSize: 24,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    width: 120,
    textAlign: 'center',
  },
  whiteboardContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',

  },
  whiteboardInputContent: {
    width: '80%',
    height: '80%',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    fontSize: 18,
    borderRadius: 10,
  },
  whiteboardInputName: {
    width: 200,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff',
    padding: 10,
    margin: 20,
    fontSize: 18,
    borderRadius: 10,
    textAlign: 'center',
  },
  whiteboardInputDesc: {
    width: 200,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff',
    height: 100,
    padding: 10,
    margin: 20,
    fontSize: 16,
    borderRadius: 10,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  popupText: {
    fontSize: 20,
    marginTop: 10,
    color: 'green',
  },
  savedContentContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  savedContentText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  savedContent: {
    fontSize: 16,
    textAlign: 'center',
  },
  });

  export default Styling;