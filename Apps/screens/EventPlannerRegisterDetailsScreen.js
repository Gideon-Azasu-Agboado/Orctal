import { View, Text, ImageBackground, Image, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { app } from '../../firebaseConfig'
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useUser } from '@clerk/clerk-expo'


import colors from '../../utils/colors'
const OrctalBg = require("../../assets/images/Orctal new bg.png")
const OrctalLogo = require("../../assets/images/Orctal logo.png")
import GradientText from '../components/GradientText'
const Close = require("../../assets/images/close.png")
const db = getFirestore(app);


export default function EventPlannerRegisterDetailsScreen({ navigation }) {
    const { user } = useUser();

    const [emailAddress, setEmailAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [leastPrice, setLeastPrice] = useState('');
    const [highPrice, setHighPrice] = useState('');
    const [errorsMsg, setErrorsMsg] = useState({});
    const [loading, setLoading] = useState(false);


    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        } else {
            alert('You did not select any image.');
        }
    };

    const removeImageFromList = () => {
        setImage(null)
    }

    useEffect(() => {
        const errors = {}

        if (!emailAddress) {
            errors.email = 'Enter email address'
        }

        if (!phone) {
            errors.phone = 'Enter phone number'
        }

        if (!name) {
            errors.name = 'Enter name'
        }

        if (!location) {
            errors.location = 'Enter location'
        }

        if (!description) {
            errors.description = 'Enter description'
        }

        if (!leastPrice) {
            errors.leastPrice = 'Enter least price'
        }

        if (!highPrice) {
            errors.highPrice = 'Enter highest price'
        }

        if (!image) {
            errors.image = 'Upload a picture of yourself'
        }

        setErrorsMsg(errors)
    }, [emailAddress, name, phone, location, description, leastPrice, highPrice, image])

    const handleFormValidation = () => {
        if (Object.keys(errorsMsg).length !== 0) {
            const values = Object.values(errorsMsg).join('\n');
            Alert.alert(
                'Reminder',
                values,
                [{
                    text: 'OK'
                }]
            )
        } else {
            setLoading(true)
            submitData()
        }
    }

    const uploadImageToFirebase = async (imageUri, fileName) => {
        const storage = getStorage();
        const imageRef = ref(storage, `images/${fileName}`);
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const uploadTask = uploadBytesResumable(imageRef, blob);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Handle upload progress
                },
                (error) => {
                    // Handle upload errors
                    reject(error);
                },
                () => {
                    // Handle successful uploads on complete
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };


    const submitData = async () => {
        try {
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
            const downloadURL = await uploadImageToFirebase(image, fileName);

            const docRef = await addDoc(collection(db, "users", "ujfSur6BjvCqnOhbsZVV", "AllEventPlanners"), {
                name,
                emailAddress,
                phone,
                location,
                description,
                leastPrice,
                highPrice,
                uploadedImages: downloadURL,
                accountType: 'Event Planner',
                isFavorites: false,
                userRatings: [],
                accountStatus: 'Active',
                userLoginEmail: user.primaryEmailAddress.emailAddress,
                statusMessage: 'Out of service at the moment. Sorry for any inconvience caused',
                userLoginImage: user.imageUrl,
                userLoginName: user.fullName,
                id: user.user.id
            });
            setLoading(false)
            Alert.alert(
                'Success',
                'Details Registered Successfully'
            )
            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                  });
            }, 3000);
        } catch (error) {
            setLoading(false)
            console.error("Error adding document: ", error);
            Alert.alert(
                'Error',
                'Failed to register details. Try again later',
                [{
                    text: 'OK'
                }]
            )
        }
    }


    return (
        <ImageBackground source={OrctalBg} style={{ flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 100 }}>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <GradientText text='Register Your Details' style={{ fontWeight: '700', fontSize: 25 }} />

                <View style={{ height: 75, width: 75, backgroundColor: colors.lighterBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center', marginTop: 40, zIndex: 1, elevation: 2, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 2,} }}>
                    <View style={{ height: 65, width: 65, backgroundColor: colors.lightBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={OrctalLogo} style={{ width: 45, height: 45 }} />
                    </View>
                </View>

                <View style={{ backgroundColor: colors.buttonTextColor, paddingTop: 40, height: 350, width: '100%', borderRadius: 30, marginTop: -30 }}>
                    <ScrollView
                        style={{ paddingLeft: 20, paddingRight: 20 }}
                    >
                        <Text style={{ fontSize: 15, paddingLeft: 5, paddingTop: 40, paddingBottom: 10 }}>Business Name</Text>
                        <TextInput
                            style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10 }}
                            value={name}
                            onChangeText={(name) => setName(name)}
                        />

                        <Text style={{ fontSize: 15, paddingTop: 20, paddingLeft: 5, paddingBottom: 10 }}>Email</Text>
                        <TextInput
                            style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10 }}
                            value={emailAddress}
                            onChangeText={(email) => setEmailAddress(email)}
                            autoCapitalize='none'
                        />

                        <Text style={{ fontSize: 15, paddingTop: 20, paddingLeft: 5, paddingBottom: 10 }}>Phone Number</Text>
                        <TextInput
                            style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10 }}
                            value={phone}
                            onChangeText={(phone) => setPhone(phone)}
                            keyboardType='numeric'
                        />

                        <Text style={{ fontSize: 15, paddingTop: 20, paddingLeft: 5, paddingBottom: 10 }}>Location</Text>
                        <TextInput
                            style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10 }}
                            value={location}
                            onChangeText={(location) => setLocation(location)}
                        />

                        <Text style={{ fontSize: 15, paddingTop: 25, paddingLeft: 5, paddingBottom: 10, color: colors.deepBlue, fontWeight: 500 }}>Your Least Price</Text>
                        <TextInput
                            style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10 }}
                            value={leastPrice}
                            keyboardType='numeric'
                            onChangeText={(leastPrice) => setLeastPrice(leastPrice)}
                        />

                        <Text style={{ fontSize: 15, paddingTop: 25, paddingLeft: 5, paddingBottom: 10, color: colors.deepBlue, fontWeight: 500 }}>Your Highest Price</Text>
                        <TextInput
                            style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10 }}
                            value={highPrice}
                            keyboardType='numeric'
                            onChangeText={(highPrice) => setHighPrice(highPrice)}
                        />

                        <Text style={{ fontSize: 15, paddingTop: 20, paddingLeft: 5, paddingBottom: 10 }}>Brief Description Of Business</Text>
                        <TextInput
                            style={{ height: 120, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 20, padding: 10, textAlignVertical: 'top' }}
                            value={description}
                            onChangeText={(desc) => setDescription(desc)}
                            multiline={true}
                        />

                        <Text style={{ fontSize: 15, paddingTop: 20, paddingLeft: 5, paddingBottom: 10 }}>Upload A Picture Of Yourself</Text>
                        <View style={{ marginTop: 10, width: '100%' }}>
                            {image
                                &&
                                <View style={{ width: 100, height: 120, marginLeft: 5, marginRight: 5, alignItems: 'flex-end' }}>
                                    <TouchableOpacity
                                        style={{ height: 25, width: 25, borderRadius: 50, backgroundColor: colors.buttonTextColor, zIndex: 10, justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <TouchableOpacity
                                            style={{ height: 20, width: 20, borderRadius: 50, backgroundColor: colors.lightBlue, zIndex: 10, justifyContent: 'center', alignItems: 'center' }}
                                            onPress={() => removeImageFromList()}
                                        >
                                            <Image
                                                source={Close}
                                                style={{ height: 10, width: 10 }}
                                            />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                    <Image
                                        source={{ uri: image }}
                                        style={{ width: 100, height: 100, marginBottom: 10, borderRadius: 20, marginTop: -10 }}
                                        resizeMode="cover"
                                    />
                                </View>
                            }
                        </View>
                        <TouchableOpacity
                            style={{ backgroundColor: colors.lighterBlue, width: '70%', height: 40, justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 5, borderRadius: 10, }}
                            onPress={pickImageAsync}
                        >
                            <Text>
                                Select Images from gallery
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                <TouchableOpacity style={{ backgroundColor: colors.lightBlue, width: '100%', height: 70, justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 50, borderRadius: 100, }}>
                    <TouchableOpacity
                        style={{ width: '95%', height: 60, backgroundColor: colors.buttonColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center', display: 'flex' }}
                        onPress={handleFormValidation}
                    >
                        {
                            loading
                                ?
                                <ActivityIndicator size='small' color='#ffffff' />
                                :
                                <Text style={{ color: colors.buttonTextColor, fontSize: 16, textAlign: 'center' }}>
                                    Register
                                </Text>
                        }
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}