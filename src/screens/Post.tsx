// import { View, Text, Image, TouchableOpacity, TextInput, Alert, Platform, KeyboardAvoidingView } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import styles from '../styles/Styles'

// import { useNavigation } from '@react-navigation/native'
// import { uploadImage } from '../services/UploadFunctions'
// import { launchImageLibrary } from 'react-native-image-picker'
// import { setInPost } from '../services/DataService'
// import { getUserId } from '../utils/Auth'
// import useUserProfileStore from '../zustand/UserProfileStore'
// import { icons } from '../assets/icons'

// export default function Post(navigation: any) {
//     const userName = useUserProfileStore(store => store.usrName)
//     const userProfilePic = useUserProfileStore(store => store.profilePic)

//     const [selectedImage, setSelectedImage] = useState('');
//     const [postDesc, setPostDesc] = useState('');

//     const [adminId, setAdminId] = useState(getUserId());
//     const [postStatus, setPostStatus] = useState('public');
//     const [picName, setPicName] = useState('')
//     const [filePath, setFilePath] = useState('');
//     const [isPrivate, setIsPrivate] = useState(false);
//     navigation = useNavigation();


//     const getCurrentTime = () => {
//         const currentTime = new Date();
//         return currentTime;
//     };

//     const postData = () => {
//         let img = "";
//         if ((selectedImage.length == 0 || selectedImage == null) && (postDesc.length == 0 || postDesc == null)) {
//             Alert.alert("You cannot share an empty post");
//         } else if (picName.length !== 0) {
//             uploadImage(picName, filePath)
//                 .then((imgUrl: any) => {
//                     if (isPrivate) {
//                         setPostStatus("private");
//                     } else {
//                         setPostStatus("public");
//                     }
//                     const time = getCurrentTime().toString();
//                     setInPost(adminId, imgUrl, postDesc, time, postStatus);
//                 })
//                 .catch(err => {
//                     console.log("something went wrong!");
//                 })
//             Alert.alert("Done!")
//             navigation.goBack();
//         } else {
//             if (isPrivate) {
//                 setPostStatus("private");
//             } else {
//                 setPostStatus("public");
//             }
//             const time = getCurrentTime().toString();
//             setInPost(adminId, '', postDesc, time, postStatus);
//             Alert.alert("Done!")
//             navigation.goBack();
//         }
//     }

//     useEffect(() => {
//         console.log(userName)
//         console.log(userProfilePic)
//     }, [])

//     return (
//         <View style={[styles.container, { margin: 5 }]}>
//             <KeyboardAvoidingView>
//                 <View style={{ flexDirection: 'column', alignItems: 'center', padding: 5, gap: 20 }}>
//                     <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                         <Text style={{ textAlign: 'center', fontSize: 18 }}>Topic Of the Moth</Text>
//                     </View>
//                     <View style={[styles.adminSection, { marginTop: 10, flexDirection: 'column' }]}>
//                         <Text>topic here</Text>
//                     </View>
//                     <View style={{}}>
//                         <TouchableOpacity onPress={postData}>
//                             <Text style={styles.postButtonStyle}>View More...</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//                 <View>
//                     <View style={[styles.adminSection, { marginTop: 10, flexDirection: 'column' }]}>
//                         <Text>Share your thoughts</Text>
//                     </View>
//                     <TextInput
//                         style={[styles.postInputStyle, { borderRadius: 10,padding:10 }]}
//                         multiline={true}
//                         numberOfLines={4}
//                         value='starts with topic title'
//                         onChangeText={(text) => setPostDesc(text)}
//                         // placeholder="Share your Thoughts...."
//                         />
//                 </View>
//                 <View style={styles.postButtonContainer}>
//                     <View style={{ flex: 1 }}>
//                         <TouchableOpacity onPress={postData}>
//                             <Text style={styles.postButtonStyle}>Post</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </KeyboardAvoidingView>
//         </View>
//     )
// }
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import styles from '../styles/Styles';
import { useNavigation } from '@react-navigation/native';
import { setInPost } from '../services/DataService';
import { getUserId } from '../utils/Auth';
import { showError, showSucess } from '../utils/utility';
import { peaceTopics } from '../utils/peaceTopics';
import BackBtn from '../components/BackBtn';
import Loading from '../components/loadings/Loading';

const getCurrentMonthTopic = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    return peaceTopics.find((topic) => topic.month === currentMonth) || { topic: '', description: '' };
};
export default function Post() {
    const [postDesc, setPostDesc] = useState('');
    const [adminId] = useState(getUserId());
    const [loading,setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const { topic, description } = getCurrentMonthTopic();
    const getCurrentTime = () => new Date().toString();
    const postData = async () => {
        if (!postDesc.trim()) {
            Alert.alert('You cannot share an empty post');
            return;
        }
        const userDoc = await firestore()
      .collection('users')
      .doc(adminId)
      .get();

    if (userDoc.exists) {
      const userData = userDoc.data();

      //logic for subscriptions
    //   const transactionDate=userData?.transactionDate;
    //   const postDone=userData?.postDone;
    //   const transactionDateObj = new Date(transactionDate.seconds * 1000);
      
    //   // Get the current date
    //   const currentDate = new Date();

    //   // Calculate the difference in months
    //   const oneMonthLater = new Date(transactionDateObj);
    //   oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
       
    //   if (currentDate <= oneMonthLater && !postDone) {
       
    //   } else {
    //      showError('Failed','You can only make one post in a month!')
    //     return ;
    //   }
      // Logs true or false
    } else {
      console.log('No such user found!');
    }

        try {
        setLoading(true);

            const time = getCurrentTime();
            const post = {
                adminId,
                text: postDesc,
                time,
                topic,
            };
            await setInPost(post);
            showSucess('Success','Post shared successfully!');
            navigation.goBack();
        } catch (error) {
            if (error.message === 'You can only make one post per month.') {
                showError('Failed Make a Post', 'You can only make one post per month.');
            } else {
                // console.error('Error posting:', error);
                showError('Error', 'Failed to post. Please try again.');
            }
        }
        finally{
            setLoading(false);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
             
        <ScrollView style={[ { margin: 5 }]}>
       
          { loading&&
            <ActivityIndicator style={{position:'absolute', 
                left:'45%',top:'45%'}} size={70} />
          }
           <View style={{ alignItems: 'center', justifyContent: 'space-between' ,flexDirection:'row',width:'100%',marginHorizontal:'1%'}}>
                    <BackBtn style={{position:'relative',top:0,left:0}} />
                        <Text style={{ fontSize: 18 }}>Topic of the Month</Text>
                   <Text></Text>
                    </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', padding: 5, gap: 20 }}>
                    {/* Topic Section */}
                   
                    <View style={[styles.adminSection, { marginTop: 10,gap:5, flexDirection: 'row',alignItems:'center' }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{topic}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Text style={styles.viewMore}>View More...</Text>
                    </TouchableOpacity>
                    </View>

                    {/* View More Button */}
                    
                </View>

                {/* Share Thoughts */}
                <View>
                    <View style={[styles.adminSection, { marginTop: 10, flexDirection: 'column' }]}>
                        <Text>Share your thoughts</Text>
                    </View>
                    <TextInput
                        style={[styles.postInputStyle, { borderRadius: 10, padding: 10 }]}
                        multiline={true}
                        numberOfLines={4}
                        placeholder={`Start with "${topic}"`}
                        onChangeText={(text) => setPostDesc(text)}
                    />
                </View>

                {/* Post Button */}
                <View style={styles.postButtonContainer}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={postData}>
                            <Text style={styles.postButtonStyle}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            {/* Modal for Description */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{topic}</Text>
                        <Text style={{ marginTop: 10 }}>{description}</Text>
                        <TouchableOpacity
                            style={[styles.modalButton, { marginTop: 20 }]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={{ color: 'white' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
        </SafeAreaView>
    );
}
