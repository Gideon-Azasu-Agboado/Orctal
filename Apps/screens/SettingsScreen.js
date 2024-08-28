import { View, Text, TouchableOpacity, ImageBackground, Image, Switch, Modal, TextInput, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from "@clerk/clerk-expo";
import { app } from '../../firebaseConfig'
const db = getFirestore(app);
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const Circle = require("../../assets/images/circle.png")
const Profilepic = require("../../assets/images/events.jpg")
import colors from '../../utils/colors'

export default function SettingsScreen({ navigation }) {
  const bookingsData = useSelector((state) => state.bookingsData);
  const personalInfo = useSelector((state) => state.personalInfo);

  const [isEnabled, setIsEnabled] = useState(false);
  const [bookingsToggle, setBookingsToggle] = useState('none');
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const switchBookingsToggle = () => {
    if (bookingsToggle === 'none') {
      setBookingsToggle('flex')
    } else {
      setBookingsToggle('none')
    }
  }

  const { isLoaded, signOut } = useAuth();
  if (!isLoaded) {
    return null;
  }

  const count = bookingsData.bookingsData.length

  const submitComplaints = async () => {
    try {
      const reviewRef = await addDoc(collection(db, "userComplaints"), {
        sender: personalInfo.personalInfo.data.name,
        contactPhoneNumber: personalInfo.personalInfo.data.phone,
        contactcontactPhoneNumber: personalInfo.personalInfo.data.emailAddress,
        message,
      });
      setLoading(false)
      setShowModal(false)
      Alert.alert(
        'Success',
        'Your complaints or feedback has been sent'
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


  return (
    <View style={{ marginTop: 60, flex: 1 }}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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

          <TouchableOpacity
            style={{ width: 139, height: 40, borderRadius: 100, backgroundColor: colors.lightBlue, alignItems: 'center', flexDirection: 'row', marginLeft: 15, padding: 5, elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 2, } }}
            onPress={() => { signOut(); setLoading(true); }}
          >
            <View style={{ height: '100%', width: 32, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.buttonTextColor }}>
              <AntDesign name="poweroff" size={24} color={colors.deepViolet} />
            </View>
            {
              loading
                ?
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={{ marginLeft: 15 }}>
                    Logout
                  </Text>
                  <ActivityIndicator size={14} color={colors.oxfordBlue} style={{ paddingLeft: 5 }} />
                </View>
                :
                <Text style={{ marginLeft: 15 }}>
                  Logout
                </Text>
            }
          </TouchableOpacity>

        </View>
      </View>

      <Text style={{ paddingLeft: 15, fontSize: 18, fontWeight: 700, color: colors.deepBlue, paddingBottom: 30, paddingTop: 30 }}>
        Settings
      </Text>

      <View style={{ backgroundColor: colors.lightWhite, height: '100%', width: '100%', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, paddingTop: 60, elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 2, } }}>
        <TouchableOpacity style={{ height: 50, width: '50%', flexDirection: 'row', alignItems: 'center' }}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person" size={18} color={colors.deepBlue} />
          <Text style={{ paddingLeft: 10 }}>
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ height: 50, width: '100%', flexDirection: 'row', alignItems: 'center' }}
          onPress={() => switchBookingsToggle()}
        >
          {
            bookingsToggle === 'flex'
              ?
              <Entypo name="chevron-thin-down" size={18} color={colors.deepBlue} />
              :
              <Octicons name="history" size={18} color={colors.deepBlue} />
          }
          <Text style={{ paddingLeft: 10 }}>
            Bookings/History
          </Text>
        </TouchableOpacity>

        <View style={{ display: bookingsToggle, paddingVertical: 10, marginLeft: 30, borderRadius: 10, borderLeftWidth: 2, borderLeftColor: colors.SatinSheenGold }}>
          <TouchableOpacity style={{ height: 50, width: '70%', flexDirection: 'row', alignItems: 'center' }}
            onPress={() => navigation.navigate('EventHostHistory')}
          >
            <Text style={{ paddingLeft: 20 }}>
              Event Hosts Bookings/History
            </Text>
          </TouchableOpacity>


          <TouchableOpacity style={{ height: 50, width: '70%', flexDirection: 'row', alignItems: 'center' }}
            onPress={() => navigation.navigate('EventPlannerHistory')}
          >
            <Text style={{ paddingLeft: 20 }}>
              Event Planner Bookings/History
            </Text>
          </TouchableOpacity>
        </View>

        {/* <View style={{ height: 50, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', }}>
            <MaterialIcons name="dark-mode" size={22} color={colors.deepBlue} />
            <Text style={{ paddingLeft: 10 }}>
              Dark mode?
            </Text>
          </View>

          <Switch
            trackColor={{ false: '#767577', true: `${colors.deepBlue}` }}
            thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View> */}

        <TouchableOpacity
          style={{ height: 50, width: '100%', flexDirection: 'row', alignItems: 'center' }}
          onPress={() => setShowModal(true)}
        >
          <MaterialIcons name="feedback" size={20} color={colors.deepBlue} />
          <Text style={{ paddingLeft: 10 }}>
            Complaint or feedback
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

              <Text style={{ fontSize: 18, fontWeight: 400, textAlign: 'center', lineHeight: 25, marginTop: 20 }}>
                Enter Complaints Or Feedback
              </Text>

              <TextInput
                style={{ height: 120, width: '100%', backgroundColor: colors.buttonTextColor, borderRadius: 20, padding: 10, textAlignVertical: 'top', marginTop: 40 }}
                value={message}
                onChangeText={(message) => setMessage(message)}
                multiline={true}
                placeholder='Type here..'
              />

              <TouchableOpacity
                style={{ width: '60%', height: 40, backgroundColor: colors.buttonColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center', display: 'flex', alignSelf: 'center', marginTop: 40 }}
                onPress={() => { submitComplaints(); setLoading(true) }}
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
            </View>
          </View>
        </Modal>
      </View>
    </View>
  )
}