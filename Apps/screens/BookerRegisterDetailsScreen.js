import { View, Text, ImageBackground, Image, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { app } from '../../firebaseConfig'
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useUser } from '@clerk/clerk-expo'

import colors from '../../utils/colors'
const OrctalBg = require("../../assets/images/Orctal new bg.png")
const OrctalLogo = require("../../assets/images/Orctal logo.png")
import GradientText from '../components/GradientText'
const db = getFirestore(app);

export default function BookerRegisterDetails({ navigation }) {
    const { user } = useUser();

    const [emailAddress, setEmailAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorsMsg, setErrorsMsg] = useState({});

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

        setErrorsMsg(errors)
    }, [emailAddress, name, phone])

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

    const submitData = async () => {
        try {
            const docRef = await addDoc(collection(db, "users", "ujfSur6BjvCqnOhbsZVV", "AllBookers"), {
                name,
                emailAddress,
                phone,
                accountType: 'Booker',
                userLoginEmail: user?.primaryEmailAddress.emailAddress,
                userLoginImage: user.imageUrl,
                userLoginName: user?.fullName,
                id: user?.id
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
            <KeyboardAvoidingView>
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <GradientText text='Register Your Details' style={{ fontWeight: '700', fontSize: 25 }} />

                    <View style={{ height: 75, width: 75, backgroundColor: colors.lighterBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center', marginTop: 40, zIndex: 1, elevation: 2, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 2,} }}>
                        <View style={{ height: 65, width: 65, backgroundColor: colors.lightBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={OrctalLogo} style={{ width: 45, height: 45 }} />
                        </View>
                    </View>

                    <View style={{ backgroundColor: colors.buttonTextColor, paddingTop: 40, paddingBottom: 40, height: 350, width: '100%', borderRadius: 30, marginTop: -30 }}>
                        <ScrollView
                            style={{ paddingLeft: 20, paddingRight: 20 }}
                        >
                            <Text style={{ fontSize: 15, paddingLeft: 5, paddingBottom: 10 }}>Full Name</Text>
                            <TextInput
                                style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10 }}
                                value={name}
                                onChangeText={(name) => setName(name)}
                            />

                            <Text style={{ fontSize: 15, paddingTop: 20, paddingLeft: 5, paddingBottom: 10 }}>Email</Text>
                            <TextInput
                                style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10 }}
                                value={emailAddress}
                                autoCapitalize='none'
                                onChangeText={(email) => setEmailAddress(email)}
                            />

                            <Text style={{ fontSize: 15, paddingTop: 20, paddingLeft: 5, paddingBottom: 10 }}>Phone Number</Text>
                            <TextInput
                                style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10 }}
                                value={phone}
                                onChangeText={(phone) => setPhone(phone)}
                                keyboardType='numeric'
                            />
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
            </KeyboardAvoidingView>
        </ImageBackground>
    )
}