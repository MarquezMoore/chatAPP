import React from 'react';
import { 
  StyleSheet,
  View, 
  Text 
} from 'react-native'

const Chat = ({ route, navigation }) => {
  const { name, backgroundColor } = route.params;

  React.useEffect(() => {
    navigation.setOptions({title: name });
  }, []);
  
  return (
    <View style={{
      flex: 1,
      backgroundColor: backgroundColor,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Text>
        Chat
      </Text>
    </View>
  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0000',
//     justifyContent: 'center',
//     alignItems: 'center'
//   }
// })

export default Chat;
