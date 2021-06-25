import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet,
  View, 
  Text,
  Bubble,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import PropTypes from 'prop-types';

const Chat = ({ route, navigation }) => {
  const [ messages, setMessages ] = useState([]);
  const { name, backgroundColor } = route.params;

  useEffect(() => {
    // Set the screen title to name prop passed from Home screen
    navigation.setOptions({title: name });
    // Set default messages
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: messages.length === 2 ? `Hello ${name}! Thanks for entering the chat!` : null,
        createdAt: new Date(),
        system: true,
      },
    ])
  }, [])

  // Use Callback hook prevent this method from be recreated every render. 
  const onSend = useCallback((messages = []) => {
    // The GiftedChat.append mehtod appends the previous state with the current item to be added
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  // This functino will be used to define color of message bubbles
  const renderBubble = props => {
    return (
      <Bubble
      {...props}
      wrapperStyle = {{
        right: {
          backgroundColor: 'red',
        },
        left: {
          backgroundColor: 'blue',
        }
      }} />
    );
  }
  
  return (
    <View style={{flex: 1}}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        // renderBubble={renderBubble}
      />
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  )
}

// Chat.propTypes = {
//   route: PropType.object,
//   navigation: PropTpe.object
// }

export default Chat;
