import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet,
  View, 
  Text,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import PropTypes from 'prop-types';
import firebase from 'firebase'
import 'firebase/firestore'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB6Qcfrdm4tPj6hBTcfV_RWiUp-ttcCrtY",
  authDomain: "chatapp-c3e03.firebaseapp.com",
  projectId: "chatapp-c3e03",
  storageBucket: "chatapp-c3e03.appspot.com",
  messagingSenderId: "434127239750",
  appId: "1:434127239750:web:278ad8ba650d72978e6847"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()

// Create reference to shopping list db
const chatMessagesRef = db.collection('messages');


const Chat = ({ route, navigation }) => {
  const [ messages, setMessages ] = useState([]);
  const [ uid, setUid ] = useState('');
  const { name, backgroundColor } = route.params;

  useEffect(() => {
    // Set the screen title to name prop passed from Home screen
    navigation.setOptions({title: name });
    // Set default messages
      // setMessages([
      //   {
      //     _id: 1,
      //     text: 'Hello developer',
      //     createdAt: new Date(),
      //     user: {
      //       _id: 2,
      //       name: 'React Native',
      //       avatar: 'https://placeimg.com/140/140/any',
      //     },
      //   },
      //   {
      //     _id: 2,
      //     text: messages.length > 2 ? `Hello ${name}! Thanks for entering the chat!` : null,
      //     createdAt: new Date(),
      //     system: true,
      //   },
      // ])

    // Create the athenticate for users
    let unsubscribe;
    const authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }

      setUid(user.uid);
      
      unsubscribe = chatMessagesRef.orderBy("createdAt", "desc").onSnapshot(onCollectionUpdate);
    });

    // componentWillUnmount
    return () => {
      authUnsubscribe();
      unsubscribe();
    }
  }, [])

  const onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach( doc => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });

    setMessages(messages);
  }

  // Use Callback hook prevent this method from be recreated every render. 
  const onSend = useCallback((message = []) => {
    // The GiftedChat.append mehtod appends the previous state with the current item to be added
    setMessages(previousMessages => GiftedChat.append(previousMessages, message))
    const m = message[0]
    try{
      db.collection('messages').add({
        _id: m._id,
        text: m.text,
        createdAt: m.createdAt,
        user: {
          _id: m.user._id,
          name: m.user.name,
          avatar: m.user.avatar
        }
      })
    } 
    catch( err ) {
      console.log( err )
    }
  }, [])

  // This functino will be used to define color of message bubbles
  const renderBubble = props => {
    return (
      <Bubble
      {...props}
      wrapperStyle = {{
        right: {
          backgroundColor: '#7777',
          color: '#FFF'
        },
        left: {
          backgroundColor: '#FFF',
        }
      }} />
    );
  }
  
  return (
    <View style={{flex: 1, backgroundColor: backgroundColor, zIndex: -1000, }}>
      <GiftedChat
        messages={messages}
        onSend={message => onSend(message)}
        user={{
          _id: uid,
          name: name,
          avatar: 'https://placeimg.com/140/140/any'
        }}
        renderBubble={renderBubble}
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
