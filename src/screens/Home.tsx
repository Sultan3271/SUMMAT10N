/**
 * @file Home.tsx
 * @description ?]
 * @ownership ?
 * @last modified 9/20/2023
 */

import React, { useEffect, useState } from 'react';

import { Alert, Image, Modal, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'
import Feed from '../components/Feed';
import Colors from '../theme/ScholarColors';
import Toast from 'react-native-toast-message';
import useUserProfileStore, { useUpdatePlanStore } from '../zustand/UserProfileStore';
import { getProfile } from '../services/DataService';
import { getUserId } from '../utils/Auth';
import { getAvailablePurchases, initConnection } from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Home = ({ navigation }: any) => {
	const userProfile: any = useUserProfileStore(store => store)
	const [hasUsrName, setHasUsrName] = useState(true);
	const [usrName,setUserName]=useState('');
	const { updatePlanData,setUpdatePlan }:any = useUpdatePlanStore.getState();
	const [isSubscribed,setIsSubscribed]=useState(false);
	const [visible,setVisible]=useState(false);
	console.log(JSON.stringify(userProfile, null, 2), "hommmmeee");

	const displayWelcomeMessage = () => {
		Toast.show({
			type: 'success',
			text1: "Congratulations!",
			text2: "you\'r logged in successfully!"
		});
	}
	const closeModal = () => {
		setVisible(false);
	  };
	const saveNameToFirebase = async () => {
		try {
			const uid=await auth().currentUser?.uid;
		  const userRef = firebase.firestore().collection('users').doc(uid);
		  await userRef.set({ usrName: usrName }, { merge: true }); // 'merge: true' preserves other fields
		  Alert.alert('Name saved successfully');
		  closeModal(); // Close the modal after saving
		} catch (error) {
		  console.error('Error saving name: ', error);
		  Alert.alert('Error saving name');
		}
	  };
	// async function requestUserPermission() {
	// 	const authStatus = await messaging().requestPermission();
	// 	const enabled =
	// 	  authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
	// 	  authStatus === messaging.AuthorizationStatus.PROVISIONAL;

	// 	if (enabled) {
	// 	  console.log('Authorization status:', authStatus);
	// 	}
	//   }
	const checkIfNameExist = async () => {
		if (!userProfile.usrName.equals('')) {
			setHasUsrName(true);
		} else {
			setHasUsrName(false);
		}
	}
	
    const restorePurchases = async () => {
       
        try {
          const purchases = await getAvailablePurchases();

          const activePurchase = purchases.find(
            (purchase) =>
              purchase.productId === 'Ate12'
          );
          if (activePurchase) {
            setIsSubscribed(true);
            // setLoading(false)
            // showSucess('Subscription Restored', `Active Subscription: ${activePurchase.productId}`);
          }
          
        } catch (error) {
          console.error('Error restoring purchases:', error);
        }
      };

    //   useEffect(() => {
    //     const initializeIAP = async () => {
    //       try {
    //         await initConnection();
    //         restorePurchases();
    //       } catch (error) {
    //         console.error('IAP initialization error:', error);
    //       }
    //     };
    
    //     initializeIAP();
    //   }, [updatePlanData?.status]);

	useEffect(() => {
		// if(Platform.OS==='ios'){
		// 	requestUserPermission();
		// }
		// PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
		displayWelcomeMessage();
		console.log(AsyncStorage.getItem('userID'),"this isss")
		// console.log("getUserId():",getUserId());
		// getProfile(getUserId())
		// 	.then(profile => {
		// 		console.log(JSON.stringify(profile), "yeh leh");
		// 	})
		
		checkIfNameExist();
		// messaging().onNotificationOpenedApp(remoteMessage => {
		// 	console.log('Notification caused app to open from background state:', JSON.stringify(remoteMessage));
		// 	// Navigate to the desired screen
		//   });

		//   messaging().getInitialNotification().then(remoteMessage => {
		// 	if (remoteMessage) {
		// 	  console.log('Notification caused app to open from quit state:', JSON.stringify(remoteMessage));
		// 	  // Navigate to the desired screen
		// 	}
		//   });
		// const unsubscribe = messaging().onMessage(async remoteMessage => {
		// 	console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
		// 	// Handle the message
		//   });

		// return unsubscribe;
	}, []);

	return (
		<View style={{ flex: 1, backgroundColor: Colors.lightBackground }}>
			{/* <Modal transparent={true} visible={visible} animationType="slide">
				<View style={styles.modalBackground}>
					<View style={styles.modalContainer}>
						<Text style={styles.title}>Enter your name</Text>
						<TextInput
							style={styles.input}
							placeholder="Your Name"
							value={usrName}
							onChangeText={(txt)=>setUserName(txt)}
						/>
						<View style={styles.buttonsContainer}>
							<TouchableOpacity style={styles.saveButton} onPress={saveNameToFirebase}>
								<Text style={styles.buttonText}>Save Name</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
								<Text style={styles.buttonText}>Cancel</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal> */}
			{/* <View
				style={{
					margin: 5,
					flexDirection: 'row',
					justifyContent: 'space-between',
					borderWidth: 1,
					borderColor: 'gray',
					padding: 10,
					borderRadius: 10,
				}}>
				<View>
					<Image source={require('../assets/icons/user.png')} style={{
						tintColor: Colors.primary, height: 30, width
							: 30
					}} />
				</View>
				<TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('PostStack',{userProfile})}>
					<View style={{ flex: 1, width: '80%', alignItems: 'center', justifyContent: 'center' }}>
						<Text
							style={{ fontSize: 20 }}
						>Share your thoughts...</Text>
					</View>
				</TouchableOpacity>
				<View style={{ marginLeft: 5 }}>
					<TouchableOpacity>
						<Image source={require('../assets/icons/images.png')} style={{
							height: 30, width
								: 30,
							tintColor: Colors.primary
						}} />
					</TouchableOpacity>
				</View>
			</View> */}
			<Feed isSubscribed={isSubscribed} />
		</View>
		
	);
};
const styles=StyleSheet.create({
	modalBackground: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
	  },
	  modalContainer: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 10,
		width: 300,
		alignItems: 'center',
	  },
	  title: {
		fontSize: 18,
		marginBottom: 10,
	  },
	  input: {
		width: '100%',
		height: 40,
		borderColor: '#ccc',
		borderWidth: 1,
		marginBottom: 20,
		paddingLeft: 10,
		borderRadius: 5,
	  },
	  buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
	  },
	  saveButton: {
		backgroundColor: Colors.primary,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		marginRight: 10,
	  },
	  cancelButton: {
		backgroundColor: Colors.primary,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
	  },
	  buttonText: {
		color: 'white',
		fontSize: 16,
	  },
	});

export default Home;
