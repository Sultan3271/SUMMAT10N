import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View, TextInput, Text, Platform } from 'react-native';
import styles from '../styles/Styles';
import Colors from '../theme/ScholarColors';
import { setPostLike, deletePostLike, setPostComment } from '../services/DataService'; // Import the like functions
import useUserProfileStore from '../zustand/UserProfileStore';

type PostBottomProps = {
    postID: string,
    userID: string,
    likes: any[],
    comments: any[],
    isLikedByCurrentUser: boolean,
    LikeIcon: any,
    fetchAllLikes: () => void
}

const PostBottom = (props: PostBottomProps) => {
    const userProfile: any = useUserProfileStore(store => store)
    const [comment, setComment] = useState('');
    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(props.isLikedByCurrentUser);
    const [likes, setLikes] = useState(props.likes);
    const [LikeIcon, setLikeIcon] = useState(props.LikeIcon);
    const [showComments, setShowComments] = useState(false);
    useEffect(() => {
        setLikes(props.likes);
        setIsLikedByCurrentUser(props.isLikedByCurrentUser);
        setLikeIcon(props.isLikedByCurrentUser ? require('../assets/icons/filled-like.png') : require('../assets/icons/like.png'));
    }, [props.likes, props.isLikedByCurrentUser]);

    const handleLikePost = async () => {
        if (isLikedByCurrentUser) {
            setLikeIcon(require('../assets/icons/like.png'));
            await deletePostLike(props.postID, props.userID);
        } else {
            setLikeIcon(require('../assets/icons/filled-like.png'));
            await setPostLike(props.postID, props.userID);
        }
        props.fetchAllLikes();
    }
    const sentComment = async () => {
        if (comment.length !== 0) {
            await setPostComment(props.postID, props.userID, comment, userProfile.profilePic, userProfile.usrName);
            setComment('');
        } else {
            return;
        }
    }
    
    return (
        <View>
            <View style={styles.postBottom}>
                <View style={{ width: '50%', alignItems: 'center', borderRightWidth: 1, borderColor: 'gray' }}>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleLikePost}>
                        <Image source={LikeIcon} style={{
                            height: 20, width: 20,
                            tintColor: Colors.primary,
                        }} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: '50%', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => setShowComments(!showComments)}>
                        <Image source={require('../assets/icons/speech-bubble.png')} style={{
                            height: 20, width: 20,
                            tintColor: Colors.primary
                        }} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.postBottom}>
                <View style={{ width: '50%', alignItems: 'center' }}>
                    <Text style={{ color: Colors.text, padding: 2 }}>
                        {likes.length}
                    </Text>
                </View>
                <View style={{ width: '50%', alignItems: 'center' }}>
                    <Text style={{ color: Colors.text, padding: 2 }}>
                        {props.comments.length}
                    </Text>
                </View>
            </View>
            {showComments && (
                <View style={{ padding: 5, borderTopWidth: 1 }}>
                    {
                        props.comments.map((comment, index) => {
                            return (
                                <View key={index} style={{ padding: 10, flexDirection: 'row' }}>
                                    <Image source={{ uri: comment.profilePic }} style={{ height: 40, width: 40, borderRadius: 50 }}></Image>
                                    <View style={{ justifyContent: 'center', marginLeft: 10, backgroundColor: Colors.lightBackground, flex: 1, padding: 10, borderRadius: 20 }}>
                                        <Text style={{fontSize:18,color:'black'}}>
                                            {comment.usrName}
                                        </Text>
                                        <Text style={{marginLeft:2,color:Colors.text}}>
                                            {comment.comment}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })
                    }
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextInput onChangeText={(txt) => setComment(txt)} value={comment} style={{ borderWidth: 1, flex: 1, borderRadius: 20, marginRight: 10, borderColor: 'gray' ,padding:Platform.OS==='ios'?10:0}} placeholder='Type comment' />
                        <TouchableOpacity style={{ backgroundColor: Colors.primary, padding: 10, borderRadius: 10 }} onPress={sentComment}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

export default PostBottom;
