import React, { useState } from 'react';
import { 
  StyleSheet,
  View, 
  Text, 
  Button,
  TextInput
} from 'react-native'

const Home = ({ navigation }) => {
  const [ name, setName ] = useState('');
  const [ inputVal, setInputVal ] = useState('');

  const handlePress = e => {
    setName(e.target.value);
    navigation.navigate('Chat', {name: name})
  }

 


  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        type="text" 
        onChangeText={inputVal => setInputVal(inputVal)}
        defaultValue={inputVal}
        placeholder="Enter name"
      />
      <Button 
        title="Visit Screen 2" 
        onPress={handlePress} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    borderWidth: .2,
    width: 200,
    height: 30,
    borderColor: "#20232a"
  }
})



export default Home;