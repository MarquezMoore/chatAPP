import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet,
  View, 
  Text,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { GiftedChat, InputToolBar, Bubble } from 'react-native-gifted-chat';
// Firebase is a package for connecting with cloud base db solution provided by Google
import firebase from 'firebase';
import 'firebase/firestore';
// AsyncStorage in a package used to add localStorage like functionality to a native app
import AsyncStorage from '@react-native-async-storage/async-storage';
// NetInfo in a package used to determine the network status of the client
import NetInfo from '@react-native-community/netinfo';

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
  const [ networkStatus, setNetworkStatus ] = useState(null);

  const { name, backgroundColor } = route.params;

  // Get messages
  const getMessages = async () => {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      console.log(messages);
      setMessages(JSON.parse(messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Save messages
  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // Delete messages
  const deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      setMessags(messages)
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    let unsubscribeMessages;
    let unsubscribeAuth
    // Update networkStatus
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        setNetworkStatus('Online');
        console.log('Online');

        // Set the screen title to name prop passed from Home screen
        navigation.setOptions({title: name });
      
        // Create the athenticate for users
        
        unsubscribeAuth = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }

          setUid(user.uid);
          
          unsubscribeMessages = chatMessagesRef.orderBy("createdAt", "desc").onSnapshot(onCollectionUpdate);
        });

        // componentWillUnmount
        return () => {
          unsubscribeAuth();
          unsubscribeMessages();
        }
      } else {
        setNetworkStatus('Offline');
        console.log('Offline')
        getMessages();
      }
    });
  }, [])

  useEffect(() => {
    saveMessages();
  }, [messages])

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
    setMessages(previousMessages => GiftedChat.append(previousMessages, message));

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

  // Function be used to define color of message bubbles
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

  // Function used to enable the InputToolBar is the use is online and disable if out
  const renderInputToolBar = props => {
    console.log('rednerInputToolBar')
    if (networkStatus === 'Offline') {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
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
        renderInputToolBar={renderInputToolBar}
      />
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  )
}

export default Chat;
