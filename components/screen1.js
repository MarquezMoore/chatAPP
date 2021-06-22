import React from 'react';
import { View, Text, Button } from 'react-native'

const Screen1 = () => {
  return (
    <View stlye={styles.container}>
      <Text>
        This is Screen 1
      </Text>
      <Button 
        title="Visit Screen 2" 
        onPress={() => this.props.navigation.navigate('Screen2')} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center'
  }
})

export default Screen1;