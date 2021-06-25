import React, { useState } from 'react';
import { 
  StyleSheet,
  Image,
  View, 
  Text, 
  Pressable,
  Platform,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';


const Home = ({ navigation }) => {
  const [ inputVal, setInputVal ] = useState('');
  const [ backgroundColor, setBackgroundColor ] = useState('');

  // When called this function will use the navigator the navigate to the chat screen, whilst passing name of user and background color 
  const handlePress = e => {
    navigation.navigate('Chat', {
      name: inputVal,
      backgroundColor: backgroundColor
    })
  }

  // Color opotion for chat screen 
  const colors = [ '#090C08', '#474056', '#8A95A5', '#B9C6AE' ]

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ImageBackground source={require('../assets/backgroundImage.png')} style={styles.backgroundImage}>

          <View style={styles.headerContainer}>
            <Text style={styles.title}>Lets Chat!</Text>
          </View>

          <View style={styles.inputContainer}>
            <Image style={styles.inputIcon} source={require('../assets/icon.svg')} />
            <TextInput 
              style={styles.input}
              type="text" 
              onChangeText={inputVal => setInputVal(inputVal)}
              defaultValue={inputVal}
              placeholder="Enter name"
            />
            <View style={styles.colorOptionsContainer}>
              <Text style={styles.colorOptionsTitle}>Choose Background Color:</Text>
              <View style={styles.colorOptions}>
                {/* Map through the color and render the respective component in the current color */}
                {
                  colors.map( (c, i) => {
                    return (
                      <TouchableOpacity 
                        key={`color-${i}`} 
                        style={{
                          width: 50,
                          height: 50,
                          marginRight: 20,
                          borderRadius: 25,
                          backgroundColor: c
                        }}
                        onPress={() => setBackgroundColor(c)}/>
                    )
                  })
                }
              </View>
            </View>
            <Pressable 
              style={styles.button}
              onPress={handlePress} 
              >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </Pressable>
          </View>
        </ImageBackground>
    </KeyboardAvoidingView>
  )
}

// Start for screen styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  backgroundImage: {
    flex: 1,
    alignSelf: 'stretch',
    resizeMode: "cover",
    alignItems: 'center',
    justifyContent: "center"
  },
  headerContainer: {
    height: '50%',
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  title: {
    color: '#FFFFFF',
    marginTop: 75,
    fontSize: 45,
    fontWeight: '600'

  },
  inputContainer: {
    position: 'relative',
    width: '88%',
    height: '44%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20
  },
  input: {
    borderWidth: .5,
    width: '88%',
    height: 50,
    borderColor: "#20232a",
    fontSize: 16, 
    fontWeight: '300', 
    color: '#757083', 
    opacity: 50,
    paddingLeft: 50 
  },
  inputIcon: {
    position: 'absolute', 
    backgroundColor: 'red', 
    left: 37, 
    top: 35
  },
  colorOptionsContainer: {
    justifyContent: 'flex-start',
    width: '88%'
  },
  colorOptionsTitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 15
  },
  colorOptions: {
    flexDirection: 'row'
  },
  button: {
    width: '88%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#757083',
    height: 50,
    padding: 10
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  }
})

export default Home;