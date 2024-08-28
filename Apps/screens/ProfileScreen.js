import { View, Text, TouchableOpacity, Image, ImageBackground, TextInput, KeyboardAvoidingView, ActivityIndicator, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { app } from '../../firebaseConfig'
import { getFirestore, collection, query, getDocs, where, doc, updateDoc } from "firebase/firestore";
const db = getFirestore(app);
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';


const Circle = require("../../assets/images/circle.png")
const Profilepic = require("../../assets/images/events.jpg")
import colors from '../../utils/colors'
import { userDataSlice } from '../../context/userDataSlice';

export default function ProfileScreen() {
  const bookingsData = useSelector((state) => state.bookingsData);
  const personalInfo = useSelector((state) => state.personalInfo);
  const dispatch = useDispatch();

  const count = bookingsData.bookingsData.length

  const [edit, setEdit] = useState(false)
  const [emailAddress, setEmailAddress] = useState(personalInfo.personalInfo.data.emailAddress);
  const [phone, setPhone] = useState(personalInfo.personalInfo.data.phone);
  const [name, setName] = useState(personalInfo.personalInfo.data.name);
  const [loading, setLoading] = useState(false);

  const updateUserData = async () => {
    const bookerRef = doc(db, "users", "ujfSur6BjvCqnOhbsZVV", "AllBookers", personalInfo.personalInfo.docid);
    try {
      await updateDoc(bookerRef, {
        name,
        emailAddress,
        phone,
      });
      setLoading(false)
      fetchData()
      Alert.alert(
        'Success',
        'Your info has been updated successfully'
      )
      setEdit(false)
    } catch (error) {
      console.log('Error updating document:', error);
      setLoading(false)
      Alert.alert(
        'Error',
        'Problem updating data. Try again later'
      )
    }
  }

  const fetchData = async () => {
    const q = query(collection(db, "users", "ujfSur6BjvCqnOhbsZVV", "AllBookers"), where("id", "==", personalInfo.personalInfo.data.id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dispatch(userDataSlice.actions.setUserData({
        docid: doc.id, data: doc.data()
      }));
    })
  };

  return (
    <View>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
        <ImageBackground
          source={Circle}
          style={{ height: 210, width: 210, justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={{ height: 155, width: 155, backgroundColor: colors.deepViolet, borderRadius: 300, justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 2, } }}>
            <Image
              style={{ height: 140, width: 140, borderRadius: 200 }}
              source={Profilepic}
            />
          </View>
        </ImageBackground>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 15 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <View style={{ borderRadius: 10, backgroundColor: colors.deepViolet, justifyContent: 'center', alignItems: 'center', elevation: 15, paddingHorizontal: 10, paddingVertical: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15, shadowOffset: { width: 0, height: 2, } }}>
              <Text style={{ color: colors.buttonTextColor }}>
                {count}
              </Text>
            </View>

            <Text style={{ paddingLeft: 7 }}>
              Bookings
            </Text>
          </View>

        </View>
      </View>

      <View style={{ backgroundColor: colors.lightWhite, height: '100%', width: '90%', borderRadius: 20, paddingHorizontal: 45, marginTop: 70, alignSelf: 'center', elevation: 15, marginBottom: 30, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15, shadowOffset: { width: 0, height: 2, } }}>
        <View style={{ height: 55, width: 55, borderRadius: 100, backgroundColor: colors.buttonTextColor, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: -25, elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2, } }}>
          <Ionicons name="person" size={18} color={colors.deepViolet} />
        </View>

        <Text style={{ fontSize: 16, fontWeight: 400, paddingLeft: 7, textAlign: 'center', paddingTop: 10 }}>
          Profile
        </Text>

        <View>
          {
            edit
              ?
              <View>
                <ScrollView style={{ paddingBottom: 60 }}>
                  <Text style={{ color: colors.deepBlue, paddingTop: 20 }}>
                    Full Name
                  </Text>
                  <TextInput
                    style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10, marginTop: 10 }}
                    defaultValue={name}
                    onChangeText={(name) => setName(name)}
                  />

                  <Text style={{ color: colors.deepBlue, paddingTop: 20 }}>
                    Email
                  </Text>
                  <TextInput
                    style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10, marginTop: 10 }}
                    defaultValue={emailAddress}
                    autoCapitalize='none'
                    onChangeText={(email) => setEmailAddress(email)}
                  />

                  <Text style={{ color: colors.deepBlue, paddingTop: 20 }}>
                    Phone
                  </Text>
                  <TextInput
                    style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10, marginTop: 10 }}
                    defaultValue={phone}
                    onChangeText={(phone) => setPhone(phone)}
                    keyboardType='numeric'
                  />

                  <TouchableOpacity style={{ backgroundColor: colors.lightBlue, width: '60%', height: 50, justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 30, borderRadius: 100, alignSelf: 'center' }}>
                    <TouchableOpacity
                      style={{ width: '95%', height: 40, backgroundColor: colors.buttonColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center', display: 'flex' }}
                      onPress={() => { updateUserData(); setLoading(true) }}
                    >
                      {
                        loading
                          ?
                          <ActivityIndicator size='small' color='#ffffff' />
                          :
                          <Text style={{ color: colors.buttonTextColor, fontSize: 16, textAlign: 'center' }}>
                            Save
                          </Text>
                      }
                    </TouchableOpacity>
                  </TouchableOpacity>
                </ScrollView>
              </View>
              :
              <View>
                <View>
                  <Text style={{ color: colors.deepBlue, paddingTop: 35, fontSize: 15 }}>
                    Full Name
                  </Text>

                  <Text style={{ paddingTop: 5 }}>
                    {personalInfo.personalInfo.data.name}
                  </Text>
                </View>

                <View>
                  <Text style={{ color: colors.deepBlue, paddingTop: 15, fontSize: 15 }}>
                    Email
                  </Text>

                  <Text style={{ paddingTop: 5 }}>
                    {personalInfo.personalInfo.data.emailAddress}
                  </Text>
                </View>

                <View>
                  <Text style={{ color: colors.deepBlue, paddingTop: 15, fontSize: 15 }}>
                    Phone
                  </Text>

                  <Text style={{ paddingTop: 5 }}>
                    {personalInfo.personalInfo.data.phone}
                  </Text>
                </View>

              </View>
          }
        </View>
      </View>

      <TouchableOpacity
        style={{ height: 45, width: 45, borderRadius: 10, backgroundColor: colors.deepViolet, position: 'absolute', top: '45%', marginLeft: 5, alignItems: 'center', justifyContent: 'center', elevation: 15, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15, shadowOffset: { width: 0, height: 2, } }}
        onPress={() => setEdit(!edit)}
      >
        <Entypo name="brush" size={22} color={colors.buttonTextColor} />
      </TouchableOpacity>
    </View>
  )
}