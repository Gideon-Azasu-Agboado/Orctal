import { View, Text, TouchableOpacity, Image, FlatList, ImageBackground, Modal, Alert, TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Animated, { useSharedValue, withSpring, } from 'react-native-reanimated';
import { app } from '../../firebaseConfig'
const db = getFirestore(app);
import { getFirestore, doc, updateDoc, addDoc, query, onSnapshot, getDocs, collection, arrayUnion, where } from "firebase/firestore";
import { bookingsSlice } from '../../context/bookingsSlice';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';


import colors from '../../utils/colors'

export default function HistoryCard({ bookingsData }) {
    const personalInfo = useSelector((state) => state.personalInfo);

    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false)
    const [ratings, setRatings] = useState();
    const [radio1Color, setRadio1Color] = useState('#DFD9D9')
    const [radio2Color, setRadio2Color] = useState('#DFD9D9')
    const [radio3Color, setRadio3Color] = useState('#DFD9D9')
    const [radio4Color, setRadio4Color] = useState('#DFD9D9')
    const [radio5Color, setRadio5Color] = useState('#DFD9D9')
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('')
    const [sender, setSender] = useState('')
    const [receiver, setReceiver] = useState('')
    const width = useSharedValue('0%');


    const selectRadio1 = () => {
        setRatings(1)
        setRadio1Color(colors.buttonColor)
        setRadio2Color('#DFD9D9')
        setRadio3Color('#DFD9D9')
        setRadio4Color('#DFD9D9')
        setRadio5Color('#DFD9D9')
        width.value = withSpring('20%');
    }

    const selectRadio2 = () => {
        setRatings(2)
        setRadio1Color('#DFD9D9')
        setRadio2Color(colors.buttonColor)
        setRadio3Color('#DFD9D9')
        setRadio4Color('#DFD9D9')
        setRadio5Color('#DFD9D9')
        width.value = withSpring('40%');
    }

    const selectRadio3 = () => {
        setRatings(3)
        setRadio1Color('#DFD9D9')
        setRadio2Color('#DFD9D9')
        setRadio3Color(colors.buttonColor)
        setRadio4Color('#DFD9D9')
        setRadio5Color('#DFD9D9')
        width.value = withSpring('60%');
    }

    const selectRadio4 = () => {
        setRatings(4)
        setRadio1Color('#DFD9D9')
        setRadio2Color('#DFD9D9')
        setRadio3Color('#DFD9D9')
        setRadio4Color(colors.buttonColor)
        setRadio5Color('#DFD9D9')
        width.value = withSpring('80%');
    }

    const selectRadio5 = () => {
        setRatings(5)
        setRadio1Color('#DFD9D9')
        setRadio2Color('#DFD9D9')
        setRadio3Color('#DFD9D9')
        setRadio4Color('#DFD9D9')
        setRadio5Color(colors.buttonColor)
        width.value = withSpring('100%');
    }

    const fetchBookingsData = async () => {
        const bookingArray = []
        const q = query(collection(db, "BookerAndEventHostsBookingsLog"));

        const unsuscribe = await onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const bookingData = { ...doc.data() };
                const timeStamp = bookingData.timeStamp.toDate().toLocaleString();

                bookingArray.push({
                    docid: doc.id,
                    data: {
                        ...bookingData,
                        timeStamp: timeStamp,
                    },
                })
            })
            dispatch(bookingsSlice.actions.setBookingsData(bookingArray));
        });
    }

    const changeStatus = async (documentId, status) => {
        const historyRef = doc(db, "BookerAndEventHostsBookingsLog", documentId);
        try {
            await updateDoc(historyRef, {
                status: status
            });
            fetchBookingsData()
        } catch (error) {
            console.log('Error updating document:', error);
        }
    }

    const submitRatingsAndReviewsData = async (hostName, subdoc) => {
        try {
            const reviewRef = await addDoc(collection(db, "userReviews"), {
                receiver: hostName,
                sender: personalInfo.personalInfo.data.name,
                message,
            });

            const querySnapshot = await getDocs(query(collection(db, "users", "ujfSur6BjvCqnOhbsZVV", subdoc), where('name', '==', hostName)));
            querySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    userRatings: arrayUnion(ratings)
                });
            });

            setLoading(false)
            setShowModal(false)
            Alert.alert(
                'Success',
                'Reviews and ratings has been sent'
            )
        } catch (error) {
            setLoading(false)
            setShowModal(false)
            console.error("Error adding document: ", error);
            Alert.alert(
                'Error',
                'Failed to submit. Try again later',
                [{
                    text: 'OK'
                }]
            )
        }
    }

    // console.log(bookingsData)


    return (
        <FlatList
            data={bookingsData}
            style={{ marginBottom: 350 }}
            renderItem={({ item, index }) => {
                const dateOnly = item.data.timeStamp.split(',')
                const imageUri = item.data.bookingType === 'Host' ? item.data.uploadedImages.downloadURLs[0] : item.data.uploadedImages
                return (
                    <View style={{ width: '100%', backgroundColor: colors.buttonTextColor, paddingTop: 30, padding: 5, borderRadius: 20, elevation: 5, marginBottom: 30, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2, }, }}>
                        {
                            item.data.bookingType === 'Host'
                                ?
                                <ImageBackground
                                    source={{ uri: imageUri }}
                                    style={{ width: '100%', height: 150 }}
                                    imageStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}
                                >
                                    <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.5)', borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                                        <View style={{ paddingRight: 10, paddingTop: 10, paddingLeft: 15 }}>
                                            <View style={{ backgroundColor: colors.lightWhite, borderRadius: 100, padding: 5, paddingHorizontal: 10, alignSelf: 'flex-end' }}>
                                                <Text style={{ fontSize: 12, }}>
                                                    Booked on: {dateOnly[0]}
                                                </Text>
                                            </View>
                                            <Text style={{ color: colors.buttonTextColor, fontSize: 20, paddingTop: 60 }}>
                                                {item.data.eventHostName}
                                            </Text>
                                        </View>
                                    </View>
                                </ImageBackground>
                                :
                                <View style={{ paddingRight: 10, paddingTop: 10, paddingLeft: 15 }}>
                                    <View style={{ backgroundColor: colors.lightWhite, borderRadius: 100, padding: 5, paddingHorizontal: 10, alignSelf: 'flex-end' }}>
                                        <Text style={{ fontSize: 12, }}>
                                            Booked on: {dateOnly[0]}
                                        </Text>
                                    </View>

                                    <View style={{ height: 100, width: 100, backgroundColor: colors.buttonTextColor, alignSelf: 'center', marginTop: 30, borderRadius: 300, justifyContent: 'center', alignItems: 'center', zIndex: 5, elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 2, } }}>
                                        <Image
                                            style={{ height: 90, width: 90, borderRadius: 200 }}
                                            source={{ uri: item.data.uploadedImages }}
                                        />
                                    </View>

                                    <Text style={{ color: colors.oxfordBlue, fontSize: 16, paddingTop: 20, textAlign: 'center' }}>
                                        {item.data.eventHostName}
                                    </Text>
                                </View>
                        }
                        <View style={{ backgroundColor: colors.lightWhite, borderRadius: 20, padding: 20, paddingBottom: 20, marginTop: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <View>
                                    <Text style={{ color: colors.deepViolet, paddingTop: 15, fontWeight: 600 }}>
                                        Email
                                    </Text>
                                    <Text>
                                        {item.data.emailAddress}
                                    </Text>
                                </View>

                                <View style={{ marginLeft: 40 }}>
                                    <Text style={{ color: colors.deepViolet, paddingTop: 15, fontWeight: 500 }}>
                                        Phone
                                    </Text>
                                    <Text>
                                        {item.data.phone}
                                    </Text>
                                </View>
                            </View>

                            {
                                item.data.bookingType === 'Host'
                                &&
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View>
                                        <Text style={{ color: colors.deepViolet, paddingTop: 15, fontWeight: 500 }}>
                                            Selected Date
                                        </Text>
                                        <Text>
                                            {item.data?.selectedDate}
                                        </Text>
                                    </View>

                                    <View>
                                        <Text style={{ color: colors.deepViolet, paddingTop: 15, fontWeight: 500 }}>
                                            Selected Occasion
                                        </Text>
                                        <Text>
                                            {item.data?.selectedOccasion}
                                        </Text>
                                    </View>
                                </View>
                            }

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View>
                                    <Text style={{ color: colors.deepViolet, paddingTop: 15, fontWeight: 500 }}>
                                        Location
                                    </Text>
                                    <Text>
                                        {item.data.location}
                                    </Text>
                                </View>

                                <View style={{ marginLeft: 90 }}>
                                    <Text style={{ color: colors.deepViolet, paddingTop: 15, fontWeight: 500 }}>
                                        Status
                                    </Text>
                                    <Text>
                                        {item.data.status}
                                    </Text>
                                </View>
                            </View>

                            {
                                item.data.status === 'Active'
                                    ?
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 25 }}>
                                        <TouchableOpacity
                                            style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: colors.deepBlue, paddingVertical: 7, paddingHorizontal: 25, borderRadius: 100 }}
                                            onPress={() => {
                                                changeStatus(item.docid, 'Completed');
                                                Alert.alert(
                                                    'Heya, ' + personalInfo.personalInfo.data.name,
                                                    'What do you think about us? Do remember to rate and/or give us a review'
                                                )
                                            }}
                                        >
                                            <Text style={{ color: colors.buttonTextColor }}>
                                                Done
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{ marginLeft: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.SatinSheenGold, paddingVertical: 7, paddingHorizontal: 25, borderRadius: 100 }}
                                            onPress={() => changeStatus(item.docid, 'Cancelled')}
                                        >
                                            <Text style={{ color: colors.buttonTextColor }}>
                                                Cancel
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => setShowModal(true)}
                                        >
                                            <Text style={{ color: colors.buttonColor, marginTop: 20 }}>
                                                Rate or give us a review
                                            </Text>
                                        </TouchableOpacity>
                                        <Modal
                                            visible={showModal}
                                            onRequestClose={() => setShowModal(false)}
                                            animationType='fade'
                                            transparent={true}
                                        >
                                            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', paddingTop: 80, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                                <View style={{ backgroundColor: colors.lightWhite, width: '90%', borderRadius: 30, padding: 30, paddingTop: 40, }}>
                                                    <TouchableOpacity
                                                        style={{ height: 35, width: 35, borderRadius: 100, backgroundColor: colors.buttonTextColor, alignSelf: 'flex-end', marginBottom: 20, justifyContent: 'center', alignItems: 'center' }}
                                                        onPress={() => setShowModal(false)}
                                                    >
                                                        <AntDesign name="close" size={17} color="black" />
                                                    </TouchableOpacity>

                                                    <Text style={{ fontSize: 18, fontWeight: 400, textAlign: 'center', lineHeight: 25 }}>
                                                        Rate
                                                    </Text>

                                                    <View>
                                                        <View style={{ marginTop: 30, height: 7, width: '100%', backgroundColor: colors.buttonTextColor, borderRadius: 50, }}>
                                                            <Animated.View style={{ height: 7, width, backgroundColor: colors.buttonColor, borderRadius: 50, }} />
                                                        </View>

                                                        <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20 }}>
                                                            <TouchableOpacity style={{ backgroundColor: colors.buttonTextColor, height: 35, width: 35, borderRadius: 100, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2, } }}
                                                                onPress={selectRadio1}
                                                            >
                                                                <View style={{ height: 25, width: 25, borderRadius: 50, backgroundColor: colors.buttonTextColor, borderColor: `${radio1Color}`, borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}>
                                                                    <Text style={{ fontSize: 15, fontWeight: 500 }}>1</Text>
                                                                </View>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity style={{ backgroundColor: colors.buttonTextColor, height: 35, width: 35, borderRadius: 100, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2, } }}
                                                                onPress={selectRadio2}
                                                            >
                                                                <View style={{ height: 25, width: 25, borderRadius: 50, backgroundColor: colors.buttonTextColor, borderColor: `${radio2Color}`, borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}>
                                                                    <Text style={{ fontSize: 15, fontWeight: 500 }}>2</Text>
                                                                </View>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity style={{ backgroundColor: colors.buttonTextColor, height: 35, width: 35, borderRadius: 100, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2, } }}
                                                                onPress={selectRadio3}
                                                            >
                                                                <View style={{ height: 25, width: 25, borderRadius: 50, backgroundColor: colors.buttonTextColor, borderColor: `${radio3Color}`, borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}>
                                                                    <Text style={{ fontSize: 15, fontWeight: 500 }}>3</Text>
                                                                </View>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity style={{ backgroundColor: colors.buttonTextColor, height: 35, width: 35, borderRadius: 100, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2, } }}
                                                                onPress={selectRadio4}
                                                            >
                                                                <View style={{ height: 25, width: 25, borderRadius: 50, backgroundColor: colors.buttonTextColor, borderColor: `${radio4Color}`, borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}>
                                                                    <Text style={{ fontSize: 15, fontWeight: 500 }}>4</Text>
                                                                </View>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity style={{ backgroundColor: colors.buttonTextColor, height: 35, width: 35, borderRadius: 100, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2, } }}
                                                                onPress={selectRadio5}
                                                            >
                                                                <View style={{ height: 25, width: 25, borderRadius: 50, backgroundColor: colors.buttonTextColor, borderColor: `${radio5Color}`, borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}>
                                                                    <Text style={{ fontSize: 15, fontWeight: 500 }}>5</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>

                                                    </View>

                                                    <Text style={{ fontSize: 18, fontWeight: 400, textAlign: 'center', lineHeight: 25, marginTop: 30 }}>
                                                        Review
                                                    </Text>

                                                    <TextInput
                                                        style={{ height: 120, width: '100%', backgroundColor: colors.buttonTextColor, borderRadius: 20, padding: 10, textAlignVertical: 'top', marginTop: 20 }}
                                                        value={message}
                                                        onChangeText={(message) => setMessage(message)}
                                                        multiline={true}
                                                        placeholder='Type review here..'
                                                    />

                                                    {
                                                        item.data.bookingType === 'Host'
                                                            ?
                                                            <TouchableOpacity
                                                                style={{ width: '60%', height: 40, backgroundColor: colors.buttonColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center', display: 'flex', alignSelf: 'center', marginTop: 40 }}
                                                                onPress={() => { submitRatingsAndReviewsData(item.data.eventHostName, 'AllEventHosts'); setLoading(true) }}
                                                            >
                                                                {
                                                                    loading
                                                                        ?
                                                                        <ActivityIndicator size='small' color='#ffffff' />
                                                                        :
                                                                        <Text style={{ color: colors.buttonTextColor, fontSize: 16, textAlign: 'center' }}>
                                                                            Submit
                                                                        </Text>
                                                                }
                                                            </TouchableOpacity>
                                                            :
                                                            <TouchableOpacity
                                                                style={{ width: '60%', height: 40, backgroundColor: colors.buttonColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center', display: 'flex', alignSelf: 'center', marginTop: 40 }}
                                                                onPress={() => { submitRatingsAndReviewsData(item.data.eventHostName, 'AllEventPlanners'); setLoading(true) }}
                                                            >
                                                                {
                                                                    loading
                                                                        ?
                                                                        <ActivityIndicator size='small' color='#ffffff' />
                                                                        :
                                                                        <Text style={{ color: colors.buttonTextColor, fontSize: 16, textAlign: 'center' }}>
                                                                            Submit
                                                                        </Text>
                                                                }
                                                            </TouchableOpacity>
                                                    }
                                                </View>
                                            </View>
                                        </Modal>
                                    </View>
                            }
                        </View>
                    </View>
                )
            }}
            keyExtractor={(item) => item.docid}
        />
    )
}