import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { app } from '../../firebaseConfig'
const db = getFirestore(app);
import { getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import { bookingsSlice } from '../../context/bookingsSlice';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import colors from '../../utils/colors'
const Star = require("../../assets/images/star.png")

export default function EventPlannerSectionScreen({ route }) {
    const { description, emailAddress, highPrice, leastPrice, location, name, phone, uploadedImages } = route.params;

    const personalInfo = useSelector((state) => state.personalInfo);
    const bookingsData = useSelector((state) => state.bookingsData);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [booked, setBooked] = useState(false);

    useEffect(() => {
        const check = bookingsData.bookingsData.some((doc) => {
            return name === doc.data.eventHostName && doc.data.status === 'Active'
        })
        if (check === true) {
            setBooked(true)
        }
    }, [bookingsData])

    const fetchBookibgsData = async () => {
        const bookingArray = []
        const q = query(collection(db, "BookerAndEventHostsBookingsLog"));

        const unsuscribe = await onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const bookingData = doc.data();
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

    const submitData = async () => {
        try {
            const docRef = await addDoc(collection(db, "BookerAndEventHostsBookingsLog"), {
                eventHostName: name,
                BookerId: personalInfo.personalInfo.docid,
                emailAddress,
                phone,
                location,
                uploadedImages,
                bookingType: 'Planner',
                status: 'Active',
                timeStamp: serverTimestamp()
            });
            setLoading(false)
            fetchBookibgsData()
            Alert.alert(
                'Success',
                'You have booked ' + name + ' successfully. Check your Bookings'
            )
        } catch (error) {
            setLoading(false)
            console.error("Error adding document: ", error);
            Alert.alert(
                'Error',
                'Failed to book ' + name + '. Try again later',
                [{
                    text: 'OK'
                }]
            )
        }
    }

    return (
        <View style={{ flex: 1, marginTop: 60 }}>
            <View style={{ height: 155, width: 155, backgroundColor: colors.buttonTextColor, alignSelf: 'center', marginTop: 30, borderRadius: 300, justifyContent: 'center', alignItems: 'center', zIndex: 5, elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 2, } }}>
                <Image
                    style={{ height: 140, width: 140, borderRadius: 200 }}
                    source={{ uri: uploadedImages }}
                />
            </View>

            <View style={{ flex: 1, height: '100%', backgroundColor: colors.oxfordBlue, borderTopLeftRadius: 30, borderTopRightRadius: 40, marginTop: -40, padding: 30 }}>
                <ScrollView>
                    <View>
                        <View>
                            <Text style={{ color: colors.lightBlue, paddingTop: 55 }}>
                                Name
                            </Text>

                            <Text style={{ color: colors.lightWhite, paddingTop: 1 }}>
                                {name}
                            </Text>
                        </View>

                        <View>
                            <Text style={{ color: colors.lightBlue, paddingTop: 15 }}>
                                Email
                            </Text>

                            <Text style={{ color: colors.lightWhite, paddingTop: 1 }}>
                                {emailAddress}
                            </Text>
                        </View>

                        <View>
                            <Text style={{ color: colors.lightBlue, paddingTop: 15 }}>
                                Phone Number
                            </Text>

                            <Text style={{ color: colors.lightWhite, paddingTop: 1 }}>
                                {phone}
                            </Text>
                        </View>

                        <View>
                            <Text style={{ color: colors.lightBlue, paddingTop: 15 }}>
                                Description
                            </Text>

                            <Text style={{ color: colors.lightWhite, paddingTop: 1 }}>
                                {description}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={{ color: colors.lightBlue, paddingTop: 15 }}>
                                    Location
                                </Text>

                                <Text style={{ color: colors.lightWhite, paddingTop: 1 }}>
                                    {location}
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View>
                                    <Text style={{ color: colors.lightBlue, paddingTop: 15 }}>
                                        Least Price
                                    </Text>

                                    <Text style={{ color: colors.lightWhite, paddingTop: 1 }}>
                                        {leastPrice} Ghc
                                    </Text>
                                </View>
                            </View>

                            <View>
                                <Text style={{ color: colors.lightBlue, paddingTop: 15 }}>
                                    Highest Price
                                </Text>

                                <Text style={{ color: colors.lightWhite, paddingTop: 1 }}>
                                    {highPrice} Ghc
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={{ flexDirection: 'row', height: 45, width: '100%', backgroundColor: colors.deepViolet, borderRadius: 10, marginTop: 25, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 }}
                            onPress={() => navigation.navigate('Reviews', { name: name })}
                        >
                            <Text style={{ color: colors.lightBlue }}>
                                Check Reviews
                            </Text>
                            <Entypo name="chevron-right" size={24} color={colors.lightBlue} />
                        </TouchableOpacity>
                    </View>

                    {
                        booked
                            ?
                            <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 10 }}>
                                <View style={{ height: 45, width: 140, backgroundColor: colors.deepBlue, borderRadius: 70, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', zIndex: 10, elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 2, } }}>
                                    <Text style={{ color: colors.lighterBlue }}>
                                        Booked
                                    </Text>
                                    <Image
                                        source={Star}
                                        style={{ height: 25, width: 25, marginLeft: 5 }}
                                    />
                                </View>

                                <View style={{ width: '100%', borderRadius: 30, backgroundColor: colors.deepViolet, padding: 30, marginTop: -20 }}>
                                    <Text style={{ textAlign: 'center', color: colors.lightWhite, fontSize: 15, paddingTop: 10 }}>
                                        Contact Info
                                    </Text>
                                    <View>
                                        <Text style={{ color: colors.lightBlue, paddingTop: 18 }}>
                                            Email
                                        </Text>

                                        <Text style={{ color: colors.lightWhite, paddingTop: 1 }}>
                                            {emailAddress}
                                        </Text>
                                    </View>

                                    <View>
                                        <Text style={{ color: colors.lightBlue, paddingTop: 15 }}>
                                            Phone Number
                                        </Text>

                                        <Text style={{ color: colors.lightWhite, paddingTop: 1 }}>
                                            {phone}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            :
                            <View style={{ paddingVertical: 50, flexDirection: 'row', justifyContent: 'center', }}>
                                <TouchableOpacity
                                    style={{ height: 40, width: 110, backgroundColor: colors.deepBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}
                                    onPress={() => {submitData(); setLoading(true);}}
                                >
                                    {
                                        loading
                                            ?
                                            <ActivityIndicator size='small' color='#ffffff' />
                                            :
                                            <Text style={{ color: colors.buttonTextColor, fontSize: 16, textAlign: 'center' }}>
                                                Book
                                            </Text>
                                    }
                                </TouchableOpacity>
                            </View>
                    }
                </ScrollView>
            </View>
        </View>
    )
}