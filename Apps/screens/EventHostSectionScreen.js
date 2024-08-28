import { View, Text, ImageBackground, TouchableOpacity, ScrollView, Image, FlatList, Modal, ActivityIndicator, Alert } from 'react-native'
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

export default function EventHostSectionScreen({ route }) {
    const { allSelectedCategory, allSelectedWorkingDays, description, emailAddress, food, fromWorkingHours, highPrice, leastPrice, location, name, phone, toWorkingHours, uploadedImages } = route.params;

    const personalInfo = useSelector((state) => state.personalInfo);
    const bookingsData = useSelector((state) => state.bookingsData);
    const dispatch = useDispatch();
    const navigation = useNavigation();


    const [selectedImage, setSelectedImage] = useState('');
    const [showPictureModal, setShowPictureModal] = useState(false)
    const [showFormModal, setShowFormModal] = useState(false)
    const [loading, setLoading] = useState(false);
    const [selectedOccasion, setSelectedOccasion] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null)
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

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setSelectedDate(date.toLocaleDateString())
        hideDatePicker();
    };

    const submitData = async () => {
        try {
            const docRef = await addDoc(collection(db, "BookerAndEventHostsBookingsLog"), {
                eventHostName: name,
                BookerId: personalInfo.personalInfo.docid,
                emailAddress,
                phone,
                location,
                selectedOccasion,
                selectedDate,
                uploadedImages,
                bookingType: 'Host',
                status: 'Active',
                timeStamp: serverTimestamp()
            });
            setSelectedOccasion('')
            setSelectedDate(null)
            setLoading(false)
            setShowFormModal(false)
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
        <ImageBackground
            source={{ uri: uploadedImages.downloadURLs[0] }}
            style={{ flex: 1, }}
        >
            <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(12,9,46,0.7)', }}>
                <Text style={{ color: colors.buttonTextColor, fontSize: 22, fontWeight: 500, paddingTop: 100, paddingLeft: 30, paddingRight: 20 }}>
                    {name}
                </Text>

                <Text style={{ color: colors.lightWhite, fontSize: 14, fontWeight: 400, paddingTop: 30, paddingLeft: 30, paddingRight: 20, lineHeight: 22 }}>
                    {description}
                </Text>

                <View style={{ flex: 1, height: '100%', backgroundColor: colors.oxfordBlue, borderTopLeftRadius: 30, borderTopRightRadius: 40, marginTop: 40, padding: 30 }}>
                    <ScrollView>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View>
                                    <Text style={{ color: colors.lightBlue, paddingTop: 15 }}>
                                        Location
                                    </Text>

                                    <Text style={{ color: colors.lightWhite, paddingTop: 1 }}>
                                        {location}
                                    </Text>
                                </View>

                                <View>
                                    <Text style={{ color: colors.lightBlue, paddingTop: 15 }}>
                                        Food Services?
                                    </Text>

                                    <Text style={{ color: colors.lightWhite, paddingTop: 1 }}>
                                        {food}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View>
                                    <Text style={{ color: colors.lightBlue, paddingTop: 15 }}>
                                        Starting Hours
                                    </Text>

                                    <Text style={{ color: colors.lightWhite, paddingTop: 1 }}>
                                        {fromWorkingHours}
                                    </Text>
                                </View>

                                <View>
                                    <Text style={{ color: colors.lightBlue, paddingTop: 15 }}>
                                        Ending Hours
                                    </Text>

                                    <Text style={{ color: colors.lightWhite, paddingTop: 1 }}>
                                        {toWorkingHours}
                                    </Text>
                                </View>

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

                            <View>
                                <Text style={{ color: colors.lightBlue, paddingTop: 15 }}>
                                    Working Days
                                </Text>

                                <Text style={{ color: colors.lightWhite, paddingTop: 1 }}>
                                    {allSelectedWorkingDays.join(', ')}
                                </Text>
                            </View>

                            <View>
                                <Text style={{ color: colors.lightBlue, paddingTop: 15 }}>
                                    Occastion Types
                                </Text>

                                <Text style={{ color: colors.lightWhite, paddingTop: 1 }}>
                                    {allSelectedCategory.join(', ')}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={{flexDirection: 'row', height: 45, width: '100%', backgroundColor: colors.deepViolet, borderRadius: 10, marginTop: 25, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15  }}
                                onPress={() => navigation.navigate('Reviews', {name: name})}
                            >
                                <Text style={{ color: colors.lightBlue}}>
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

                                    <FlatList
                                        data={uploadedImages.downloadURLs}
                                        style={{ marginTop: 20, paddingLeft: 10 }}
                                        horizontal
                                        renderItem={({ item, index }) => (
                                            <View
                                            >
                                                <Image
                                                    source={{ uri: item }}
                                                    style={{ height: 100, width: 100, borderRadius: 20, marginRight: 20 }}
                                                />
                                            </View>
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                                :
                                <View style={{ paddingTop: 30, flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        style={{ height: 40, width: 110, backgroundColor: colors.deepBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}
                                        onPress={() => setShowFormModal(true)}
                                    >
                                        <Text style={{ color: colors.buttonTextColor, fontSize: 16, fontWeight: 500 }}>
                                            Book
                                        </Text>
                                    </TouchableOpacity>

                                    <Modal
                                        visible={showFormModal}
                                        onRequestClose={() => setShowFormModal(false)}
                                        animationType='fade'
                                        transparent={true}
                                    >
                                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', paddingTop: 80, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ backgroundColor: colors.lightWhite, width: '90%', borderRadius: 30, padding: 30, paddingTop: 60, }}>
                                                <Text style={{ fontSize: 18, fontWeight: 400, textAlign: 'center', lineHeight: 25 }}>
                                                    Fill the available form fields to book -
                                                    <Text style={{ fontSize: 18, fontWeight: 500, color: colors.deepBlue, }}>
                                                        {' ' + name}.
                                                    </Text>
                                                </Text>

                                                <View style={{ marginTop: 20 }}>
                                                    <Text>
                                                        What's the occasion?
                                                    </Text>
                                                    <Picker
                                                        selectedValue={selectedOccasion}
                                                        onValueChange={(itemValue, itemIndex) =>
                                                            setSelectedOccasion(itemValue)
                                                        }
                                                        style={{ backgroundColor: colors.buttonTextColor, borderRadius: 100, flexDirection: 'row', width: '100%', alignItems: 'center', elevation: 5, height: 40, marginTop: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2, } }}
                                                    >
                                                        <Picker.Item label="Select" value="Select" />
                                                        {
                                                            allSelectedCategory.map((item, index) => (
                                                                <Picker.Item label={item} value={item} key={index} />
                                                            ))
                                                        }
                                                    </Picker>
                                                </View>

                                                <View style={{ marginTop: 30 }}>
                                                    <Text>
                                                        Date of occasion?
                                                    </Text>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                                                        <TouchableOpacity
                                                            style={{ backgroundColor: colors.lighterBlue, width: '50%', height: 40, justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 5, borderRadius: 10, }}
                                                            onPress={() => showDatePicker()}
                                                        >
                                                            <Text>
                                                                Show date picker
                                                            </Text>
                                                        </TouchableOpacity>
                                                        <DateTimePickerModal
                                                            isVisible={isDatePickerVisible}
                                                            mode="date"
                                                            onConfirm={handleConfirm}
                                                            onCancel={hideDatePicker}
                                                        />
                                                        <Text style={{ fontSize: 16 }}>
                                                            {selectedDate}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
                                                    <TouchableOpacity
                                                        style={{ height: 40, width: 110, backgroundColor: colors.deepBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}
                                                        onPress={() => { submitData(); setLoading(true); }}
                                                    >
                                                        {
                                                            loading
                                                                ?
                                                                <ActivityIndicator size='small' color='#ffffff' />
                                                                :
                                                                <Text style={{ color: colors.buttonTextColor, fontSize: 16, fontWeight: 500 }}>
                                                                    Submit
                                                                </Text>
                                                        }

                                                    </TouchableOpacity>
                                                </View>

                                            </View>
                                        </View>
                                    </Modal>

                                    <FlatList
                                        data={uploadedImages.downloadURLs}
                                        style={{ marginLeft: 20, paddingLeft: 10 }}
                                        horizontal
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity
                                                onPress={() => { setShowPictureModal(true); setSelectedImage(item); }}
                                            >
                                                <Image
                                                    source={{ uri: item }}
                                                    style={{ height: 100, width: 100, borderRadius: 20, marginRight: 20 }}
                                                />
                                            </TouchableOpacity>
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                    />

                                    <Modal
                                        visible={showPictureModal}
                                        onRequestClose={() => setShowPictureModal(false)}
                                        animationType='fade'
                                        transparent={true}
                                    >
                                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', paddingTop: 80, width: '100%', }}>
                                            <Image
                                                source={{ uri: selectedImage }}
                                                style={{ height: 400, width: '100%', borderRadius: 20, marginRight: 20, marginTop: 20, }}
                                                resizeMode='contain'
                                            />

                                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                                <TouchableOpacity
                                                    style={{ height: 60, width: 60, borderRadius: 100, borderWidth: 1, borderColor: colors.lightWhite, justifyContent: 'center', alignItems: 'center' }}
                                                    onPress={() => setShowPictureModal(false)}
                                                >
                                                    <AntDesign name="close" size={24} color={colors.lightWhite} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>
                                </View>
                        }
                    </ScrollView>
                </View>
            </View>
        </ImageBackground>
    )
}