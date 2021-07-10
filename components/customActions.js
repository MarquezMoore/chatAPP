import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

class CustomActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      location: null,
    }
  }
  
  onActionPress = () => {
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
  }; 

  pickImage = async () => {
    const library = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (library.status !== 'granted') return alert('Sorry, we need camera roll permissions to make this work!');
  

    let image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!image.cancelled) {
      this.setState({
        image: image.uri
      });
    }
  };

  takePhoto = async () => {
    const camera = await ImagePicker.requestCameraPermissionsAsync();
    const library = await ImagePicker.requestMediaLibraryPermissionsAsync();

    console.log(`Library Access: ${library.status}`)
    console.log(`Camera Access: ${camera.status}`)

    if (camera.status && library.status !== 'granted') return alert( `Camera and photo library access is needed to use this functionality`)

    let image = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    this.setState({
      image: image.uri
    });
  }
  
  getLocation = async () =>{
    const locationAccess = await Location.requestForegroundPermissionsAsync();


    if( locationAccess.status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});

      if (location){
        this.setState({
          location: location
        });
      }
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
