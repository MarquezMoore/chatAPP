import React from 'react';
import { 
  StyleSheet,
  View, 
  Text 
} from 'react-native'

const Chat = ({ route, navigation }) => {
  const { name } = route.params;

  React.useEffect(() => {
    navigation.setOptions({title: name});
  });
  
  return (
    <View style={styles.container}>
      <Text>
        Chat
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Chat;
