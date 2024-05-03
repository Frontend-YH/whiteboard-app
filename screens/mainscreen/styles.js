import { StyleSheet, Dimensions} from 'react-native';
var width = Dimensions.get('window').width; 
var height = Dimensions.get('window').height; 
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 400,
    margin: 15,
    height: 500,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  contentContainer: {
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: '#4442',
    width: width - 28,
    marginBottom: 20,
    alignItems: 'center',
    padding: 20,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
  },
  heading: {
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
    padding: 10,
  },
  paragraf: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
    padding: 15,
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: '80%',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  themeSelector: {
    position: 'absolute',
    bottom: 40,
    right: 30,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  themeList: {
    marginTop: 10,
  },
  themeItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  themeItem: {
    fontSize: 16,
  },
  checkIcon: {
    marginLeft: 10,
  },
  });

  export default Styles;