import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import firebase from 'firebase';


class CustomActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      location: null,
    }
  }
  
  onActionPress = () => {
    try{
      const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
      const cancelButtonIndex = options.length - 1;

      this.context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        async (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              this.pickImage();
              return;
            case 1:
              this.takePhoto();
              return;
            case 2:
              this.getLocation();
            default:
          }
        },
      );
    }catch(e){
      console.log(`onActionPress err: ${e}`)
    }
  }; 

  pickImage = async () => {
    const library = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (library.status !== 'granted') return alert('Sorry, we need camera roll permissions to make this work!');
  
    try{

    }catch (e) {
      console.log(`pickImage err: ${e}`);
    }
    let image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!image.cancelled) {
      const imageURL = await this.uploadImageFetch(image.uri)
      this.props.onSend({image: imageURL })
    }
  };

  takePhoto = async () => {
    try{
      const camera = await ImagePicker.requestCameraPermissionsAsync();
      const library = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (camera.status && library.status !== 'granted') return alert( `Camera and photo library access is needed to use this functionality`)

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })   
      // Get the image blob and add the image to the onSend prop
      if(!result.cancelled){
        const imageURL = await this.uploadImageFetch(result.uri);
        this.props.onSend({ image: imageURL });        
      }
    } catch(e) {
      console.log(`takePhoto err: ${e}`);
    }
  }
  
  getLocation = async () =>{
    try{
      const locationAccess = await Location.requestForegroundPermissionsAsync();

      if( locationAccess.status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});

        if (location){
          this.props.onSend({
            location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            },
          })
        }

      }
    }catch(e) {
      console.log(`getLocation err: ${e}`);
    }
  }

  uploadImageFetch = async (uri) => {
    try{
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function(e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
  
      const imageNameBefore = uri.split("/");
      const imageName = imageNameBefore[imageNameBefore.length - 1];
      const ref = firebase.storage().ref().child(`images/${imageName}`);
      const snapshot = await ref.put(blob);
      blob.close();
  
      return await snapshot.ref.getDownloadURL();
    }catch(e) {
      console.log(`uploadImageFetch err: ${e}`)
    }
  }

  render() {
    return (
      <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
