import { View, Text, ImageBackground, Image, TextInput, TouchableOpacity, ScrollView, FlatList, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { app } from '../../firebaseConfig'
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useUser } from '@clerk/clerk-expo'
import { useNavigation } from '@react-navigation/native';


import colors from '../../utils/colors'
const OrctalBg = require("../../assets/images/Orctal new bg.png")
const OrctalLogo = require("../../assets/images/Orctal logo.png")
import GradientText from '../components/GradientText'
import CheckBox from '../components/CheckBox';
const Close = require("../../assets/images/close.png");
const db = getFirestore(app);



const allDays = [
    { name: 'Monday', checked: false },
    { name: 'Tuesday', checked: false },
    { name: 'Wednesday', checked: false },
    { name: 'Thursday', checked: false },
    { name: 'Friday', checked: false },
    { name: 'Saturday', checked: false },
    { name: 'Sunday', checked: false },
];

const allCategory = [
    { name: 'Weddings', checked: false },
    { name: 'Funerals', checked: false },
    { name: 'Parties', checked: false },
    { name: 'Business Meetings', checked: false },
    { name: 'Others', checked: false },
];

export default function EventHostRegisterDetailsScreen() {
    const user = useUser();
    const navigation = useNavigation()

    const [emailAddress, setEmailAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [fromWorkingHours, setFromWorkingHours] = useState('');
    const [toWorkingHours, setToWorkingHours] = useState('');
    const [category, setCategory] = useState(allCategory);
    const [allSelectedCategory, setAllSelectedCategory] = useState([]);
    const [leastPrice, setLeastPrice] = useState('');
    const [highPrice, setHighPrice] = useState('');
    const [food, setFood] = useState('');
    const [workingDays, setworkingDays] = useState(allDays);
    const [allSelectedWorkingDays, setAllSelectedWorkingDays] = useState([]);
    const [images, setImages] = useState([])
    const [allImages, setAllImages] = useState([]);
    const [errorsMsg, setErrorsMsg] = useState({});
    const [loading, setLoading] = useState(false);


    const handleWokingDaysCheckBoxPress = (index) => {
        setworkingDays(
            workingDays.map((day, currentIndex) =>
                currentIndex === index ? { ...day, checked: !day.checked } : day
            )
        );
    };

    const getWorkingDaysCheckedValues = () => {
        const selectedDays = workingDays.filter((day) => day.checked).map((day) => day.name);
        setAllSelectedWorkingDays(selectedDays)
    };


    const handleCategoriesCheckBoxPress = (index) => {
        setCategory(
            category.map((category, currentIndex) =>
                currentIndex === index ? { ...category, checked: !category.checked } : category
            )
        );
    };

    const getCategoriesCheckedValues = () => {
        const selectedCategories = category.filter((category) => category.checked).map((category) => category.name);
        setAllSelectedCategory(selectedCategories)
    };

    const pickImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImages(result.assets);
            groupImages(result.assets)
        }

    };

    const groupImages = (groupImage) => {
        setAllImages(prevIms => [...prevIms, groupImage])
    }

    const removeImageFromList = (imageUri) => {
        const newImages = allImages.flat().filter(item => item.uri.toString() !== imageUri.toString())
        setAllImages([newImages])
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

        if (!fromWorkingHours) {
            errors.fromWorkingHours = 'Select starting working hours'
        }

        if (!toWorkingHours) {
            errors.toWorkingHours = 'Select ending working hours'
        }

        if (allSelectedCategory.length < 1) {
            errors.category = 'Select category'
        }

        if (!leastPrice) {
            errors.leastPrice = 'Enter least price'
        }

        if (!highPrice) {
            errors.highPrice = 'Enter highest price'
        }

        if (!food) {
            errors.food = 'Select if you render food services'
        }

        if (allSelectedWorkingDays < 1) {
            errors.workingDays = 'Select working days'
        }

        if (allImages.length < 3) {
            errors.allImages = 'Choose 3 or more images'
        }

        setErrorsMsg(errors)
    }, [emailAddress, name, phone, location, description, fromWorkingHours, toWorkingHours, allSelectedCategory, leastPrice, highPrice, food, allSelectedWorkingDays, allImages])

    const handleFoormValidation = () => {
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

    const imageUris = allImages.flat().map(image => image.uri);

    const uploadImagesToFirebase = async (imageUris) => {
        const storage = getStorage();
        const promises = imageUris.map(async (imageUri, index) => {
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${index}.jpg`;
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
        });

        return Promise.all(promises);
    };

    const submitData = async () => {
        try {
            const downloadURLs = await uploadImagesToFirebase(imageUris);
            const docRef = await addDoc(collection(db, "users", "ujfSur6BjvCqnOhbsZVV", "AllEventHosts"), {
                name,
                emailAddress,
                phone,
                location,
                description,
                fromWorkingHours,
                toWorkingHours,
                allSelectedCategory,
                leastPrice,
                highPrice,
                food,
                allSelectedWorkingDays,
                uploadedImages: { downloadURLs },
                accountType: 'Event Host',
                accountStatus: 'Active',
                isFavorites: false,
                statusMessage: 'Out of service at the moment. Sorry for any inconvience caused',
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

                <View style={{ backgroundColor: colors.buttonTextColor, paddingTop: 40, paddingBottom: 40, height: 350, width: '100%', borderRadius: 30, marginTop: -30 }}>
                    <ScrollView
                        style={{ paddingLeft: 20, paddingRight: 20 }}
                    >
                        <Text style={{ fontSize: 15, paddingLeft: 5, paddingBottom: 10, paddingTop: 30, color: colors.deepBlue, fontWeight: 500 }}>Business Name</Text>
                        <TextInput
                            style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10 }}
                            value={name}
                            onChangeText={(name) => setName(name)}
                        />

                        <Text style={{ fontSize: 15, paddingTop: 25, paddingLeft: 5, paddingBottom: 10, color: colors.deepBlue, fontWeight: 500 }}>Email</Text>
                        <TextInput
                            style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10 }}
                            value={emailAddress}
                            onChangeText={(email) => setEmailAddress(email)}
                            autoCapitalize='none'
                        />

                        <Text style={{ fontSize: 15, paddingTop: 25, paddingLeft: 5, paddingBottom: 10, color: colors.deepBlue, fontWeight: 500 }}>Phone Number</Text>
                        <TextInput
                            style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10 }}
                            value={phone}
                            keyboardType='numeric'
                            onChangeText={(phone) => setPhone(phone)}
                        />

                        <Text style={{ fontSize: 15, paddingTop: 25, paddingLeft: 5, paddingBottom: 10, color: colors.deepBlue, fontWeight: 500 }}>Location</Text>
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

                        <Text style={{ fontSize: 15, paddingTop: 25, paddingLeft: 5, paddingBottom: 10, color: colors.deepBlue, fontWeight: 500 }}>Working Days</Text>

                        {workingDays.map((day, index) => (
                            <CheckBox
                                key={day.name}
                                label={day.name}
                                isChecked={day.checked}
                                onPress={() => { handleWokingDaysCheckBoxPress(index); getWorkingDaysCheckedValues(); }}
                            />
                        ))}



                        <Text style={{ fontSize: 15, paddingTop: 25, paddingLeft: 5, paddingBottom: 10, color: colors.deepBlue, fontWeight: 500 }}>Working Hours</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                            <View style={{ paddingLeft: 5 }}>
                                <Text style={{ paddingBottom: 5 }}>
                                    From
                                </Text>
                                <Picker
                                    selectedValue={fromWorkingHours}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setFromWorkingHours(itemValue)
                                    }
                                    style={{ backgroundColor: colors.buttonTextColor, borderRadius: 100, flexDirection: 'row', width: 130, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2,} }}
                                >
                                    <Picker.Item label="Select" value="Select" />
                                    <Picker.Item label="1am" value="1am" />
                                    <Picker.Item label="2am" value="2am" />
                                    <Picker.Item label="3am" value="3am" />
                                    <Picker.Item label="4am" value="4am" />
                                    <Picker.Item label="5am" value="5am" />
                                    <Picker.Item label="6am" value="6am" />
                                    <Picker.Item label="7am" value="7am" />
                                    <Picker.Item label="8am" value="8am" />
                                    <Picker.Item label="9am" value="9am" />
                                    <Picker.Item label="10am" value="10am" />
                                    <Picker.Item label="11am" value="11pm" />
                                    <Picker.Item label="12pm" value="12am" />
                                    <Picker.Item label="1pm" value="1pm" />
                                    <Picker.Item label="2pm" value="2pm" />
                                    <Picker.Item label="3pm" value="3pm" />
                                    <Picker.Item label="4pm" value="4pm" />
                                    <Picker.Item label="5pm" value="5pm" />
                                    <Picker.Item label="6pm" value="6pm" />
                                    <Picker.Item label="7pm" value="7pm" />
                                    <Picker.Item label="8pm" value="8pm" />
                                    <Picker.Item label="9pm" value="9pm" />
                                    <Picker.Item label="10pm" value="10pm" />
                                    <Picker.Item label="11pm" value="11pm" />
                                    <Picker.Item label="12am" value="12am" />
                                </Picker>
                            </View>

                            <View style={{ paddingLeft: 5 }}>
                                <Text style={{ paddingBottom: 5 }}>
                                    To
                                </Text>
                                <Picker
                                    selectedValue={toWorkingHours}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setToWorkingHours(itemValue)
                                    }
                                    style={{ backgroundColor: colors.buttonTextColor, borderRadius: 100, flexDirection: 'row', width: 130, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2,} }}
                                >
                                    <Picker.Item label="Select" value="Select" />
                                    <Picker.Item label="1am" value="1am" />
                                    <Picker.Item label="2am" value="2am" />
                                    <Picker.Item label="3am" value="3am" />
                                    <Picker.Item label="4am" value="4am" />
                                    <Picker.Item label="5am" value="5am" />
                                    <Picker.Item label="6am" value="6am" />
                                    <Picker.Item label="7am" value="7am" />
                                    <Picker.Item label="8am" value="8am" />
                                    <Picker.Item label="9am" value="9am" />
                                    <Picker.Item label="10am" value="10am" />
                                    <Picker.Item label="11am" value="11am" />
                                    <Picker.Item label="12pm" value="12pm" />
                                    <Picker.Item label="1pm" value="1pm" />
                                    <Picker.Item label="2pm" value="2pm" />
                                    <Picker.Item label="3pm" value="3pm" />
                                    <Picker.Item label="4pm" value="4pm" />
                                    <Picker.Item label="5pm" value="5pm" />
                                    <Picker.Item label="6pm" value="6pm" />
                                    <Picker.Item label="7pm" value="7pm" />
                                    <Picker.Item label="8pm" value="8pm" />
                                    <Picker.Item label="9pm" value="9pm" />
                                    <Picker.Item label="10pm" value="10pm" />
                                    <Picker.Item label="11pm" value="11pm" />
                                    <Picker.Item label="12am" value="12am" />
                                </Picker>
                            </View>
                        </View>


                        <Text style={{ fontSize: 15, paddingTop: 25, paddingLeft: 5, paddingBottom: 10, color: colors.deepBlue, fontWeight: 500 }}>Brief Description Of Your Business</Text>
                        <TextInput
                            style={{ height: 120, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 20, padding: 10, textAlignVertical: 'top' }}
                            value={description}
                            onChangeText={(desc) => setDescription(desc)}
                            multiline={true}
                        />

                        <Text style={{ fontSize: 15, paddingTop: 25, paddingLefdt: 5, paddingBottom: 10, color: colors.deepBlue, fontWeight: 500 }}>What Occasions Do You Cover</Text>
                        {category.map((category, index) => (
                            <CheckBox
                                key={category.name}
                                label={category.name}
                                isChecked={category.checked}
                                onPress={() => { handleCategoriesCheckBoxPress(index); getCategoriesCheckedValues(); }}
                            />
                        ))}

                        <Text style={{ fontSize: 15, paddingTop: 25, paddingLeft: 5, paddingBottom: 10, color: colors.deepBlue, fontWeight: 500 }}>Do You Provide Feeding Services</Text>
                        <Picker
                            selectedValue={food}
                            onValueChange={(itemValue, itemIndex) =>
                                setFood(itemValue)
                            }
                            style={{ backgroundColor: colors.buttonTextColor, borderRadius: 100, flexDirection: 'row', width: 130, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2,} }}
                        >
                            <Picker.Item label="Select" value="Select" />
                            <Picker.Item label="Yes" value="Yes" />
                            <Picker.Item label="No" value="No" />
                        </Picker>

                        <Text style={{ fontSize: 15, paddingTop: 25, paddingLeft: 5, paddingBottom: 10, color: colors.deepBlue, fontWeight: 500 }}>Upload 3 or More Images Of Your Place Of Business</Text>
                        <View style={{ marginTop: 10, width: '100%' }}>
                            <FlatList
                                data={allImages.flat()}
                                horizontal
                                renderItem={({ item }) => (
                                    <View style={{ width: 100, height: 120, marginLeft: 5, marginRight: 5, alignItems: 'flex-end' }}>
                                        <TouchableOpacity
                                            style={{ height: 25, width: 25, borderRadius: 50, backgroundColor: colors.buttonTextColor, zIndex: 10, justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            <TouchableOpacity
                                                style={{ height: 20, width: 20, borderRadius: 50, backgroundColor: colors.lightBlue, zIndex: 10, justifyContent: 'center', alignItems: 'center' }}
                                                onPress={() => removeImageFromList(item.uri)}
                                            >
                                                <Image
                                                    source={Close}
                                                    style={{ height: 10, width: 10 }}
                                                />
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                        <Image
                                            style={{ width: 100, height: 100, marginBottom: 10, borderRadius: 20, marginTop: -10 }}
                                            source={{ uri: item.uri }}
                                            resizeMode="cover"
                                        />
                                    </View>
                                )}
                                keyExtractor={(item) => item.uri}
                            />
                        </View>
                        <TouchableOpacity
                            style={{ backgroundColor: colors.lighterBlue, width: '70%', height: 40, justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 5, borderRadius: 10, }}
                            onPress={pickImages}
                        >
                            <Text>
                                Select Images from gallery
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                <TouchableOpacity
                    style={{ backgroundColor: colors.lightBlue, width: '100%', height: 70, justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 50, borderRadius: 100, }}
                >
                    <TouchableOpacity
                        style={{ width: '95%', height: 60, backgroundColor: colors.buttonColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center', display: 'flex' }}
                        onPress={handleFoormValidation}
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