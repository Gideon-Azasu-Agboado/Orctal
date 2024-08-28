import { View, Text, TouchableOpacity, Image, ImageBackground, TextInput, KeyboardAvoidingView, ActivityIndicator, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { app } from '../../firebaseConfig'
import { getFirestore, collection, query, getDocs, where, doc, updateDoc } from "firebase/firestore";
const db = getFirestore(app);

const Circle = require("../../assets/images/circle.png")
import colors from '../../utils/colors'
import CheckBox from '../components/CheckBox';

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

export default function EventHostProfileScreen() {
  const dispatch = useDispatch();
  const personalInfo = useSelector((state) => state.personalInfo);
  const bookingsData = useSelector((state) => state.bookingsData);

  const { isLoaded, signOut } = useAuth();
if (!isLoaded) {
  return null;
}

  const [edit, setEdit] = useState(false)
  const [emailAddress, setEmailAddress] = useState(personalInfo.personalInfo.data.emailAddress);
  const [phone, setPhone] = useState(personalInfo.personalInfo.data.phone);
  const [name, setName] = useState(personalInfo.personalInfo.data.name);
  const [location, setLocation] = useState(personalInfo.personalInfo.data.location);
  const [description, setDescription] = useState(personalInfo.personalInfo.data.description);
  const [fromWorkingHours, setFromWorkingHours] = useState(personalInfo.personalInfo.data.fromWorkingHours);
  const [toWorkingHours, setToWorkingHours] = useState(personalInfo.personalInfo.data.toWorkingHours);
  const [category, setCategory] = useState(allCategory);
  const [allSelectedCategory, setAllSelectedCategory] = useState([]);
  const [leastPrice, setLeastPrice] = useState(personalInfo.personalInfo.data.leastPrice);
  const [highPrice, setHighPrice] = useState(personalInfo.personalInfo.data.highPrice);
  const [food, setFood] = useState(personalInfo.personalInfo.data.food);
  const [workingDays, setworkingDays] = useState(allDays);
  const [allSelectedWorkingDays, setAllSelectedWorkingDays] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [radio1Color, setRadio1Color] = useState('#DFD9D9')
  const [radio2Color, setRadio2Color] = useState('#DFD9D9')
  const [check, setCheck] = useState(false)
  const [loading, setLoading] = useState(false);

  const selectRadio1 = () => {
    setSelectedValue('Active')
    setRadio1Color('#3744c3')
    setRadio2Color('#DFD9D9')
    setCheck(true)
  }

  const selectRadio2 = () => {
    setSelectedValue('Inactive')
    setRadio1Color('#DFD9D9')
    setRadio2Color('#3744c3')
    setCheck(true)
  }


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

  const updateUserData = async () => {
    const eventHostRef = doc(db, "users", "ujfSur6BjvCqnOhbsZVV", "AllEventHosts", personalInfo.personalInfo.docid);
    try {
      await updateDoc(eventHostRef, {
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
        accountType: 'Event Host',
        accountStatus: selectedValue,
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
    const q = query(collection(db, "users", "ujfSur6BjvCqnOhbsZVV", "AllEventHosts"), where("id", "==", personalInfo.personalInfo.data.id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dispatch(userDataSlice.actions.setUserData({
        docid: doc.id, data: doc.data()
      }));
    })
  };

  console.log([allSelectedCategory])

  return (
    <View style={{ flex: 1, paddingBottom: 20 }}>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
        <ImageBackground
          source={Circle}
          style={{ height: 210, width: 210, justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={{ height: 155, width: 155, backgroundColor: colors.deepViolet, borderRadius: 300, justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 2, } }}>
            <Image
              style={{ height: 140, width: 140, borderRadius: 200 }}
              source={{ uri: personalInfo.personalInfo.data.uploadedImages.downloadURLs[0] }}
            />
          </View>
        </ImageBackground>
      </View>

      <TouchableOpacity
            style={{ width: 139, height: 40, borderRadius: 100, backgroundColor: colors.lightBlue, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', marginLeft: 15, marginTop: 15, padding: 5, elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 2, } }}
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

      <View style={{ flex: 1, backgroundColor: colors.lightWhite, height: 'auto', width: '90%', borderRadius: 20, marginTop: 70, alignSelf: 'center', elevation: 15, paddingBottom: 100, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15, shadowOffset: { width: 0, height: 2, } }}>
        <View style={{ height: 55, width: 55, borderRadius: 100, backgroundColor: colors.buttonTextColor, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: -25, elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2, } }}>
          <Ionicons name="person" size={18} color={colors.deepViolet} />
        </View>

        {
          edit
            ?
            <Text style={{ fontSize: 16, fontWeight: 400, paddingLeft: 7, textAlign: 'center', paddingVertical: 10 }}>
              Edit Profile
            </Text>
            : <Text style={{ fontSize: 16, fontWeight: 400, paddingLeft: 7, textAlign: 'center', paddingVertical: 10 }}>
              Profile
            </Text>

        }

        <View >
          {
            edit
              ?
              <View>
                <ScrollView style={{ paddingHorizontal: 45, paddingBottom: 0 }}>
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
                  <Text style={{ fontSize: 12, paddingLeft: 5 }}>Selected Working Days :</Text>
                  <Text style={{ paddingBottom: 10, fontSize: 12, paddingLeft: 5 }}>{personalInfo.personalInfo.data.allSelectedWorkingDays.join(', ')}</Text>
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
                        style={{ backgroundColor: colors.buttonTextColor, borderRadius: 100, flexDirection: 'row', width: 130, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2, } }}
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
                        style={{ backgroundColor: colors.buttonTextColor, borderRadius: 100, flexDirection: 'row', width: 130, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2, } }}
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

                  <Text style={{ fontSize: 15, paddingTop: 25, paddingLeft: 5, paddingBottom: 10, color: colors.deepBlue, fontWeight: 500 }}>What Occasions Do You Cover</Text>
                  <Text style={{ fontSize: 12, paddingLeft: 5 }}>Selected Categories :</Text>
                  <Text style={{ paddingBottom: 10, fontSize: 12, paddingLeft: 5 }}>{personalInfo.personalInfo.data.allSelectedCategory.join(', ')}</Text>
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
                    style={{ backgroundColor: colors.buttonTextColor, borderRadius: 100, flexDirection: 'row', width: 130, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2, } }}
                  >
                    <Picker.Item label="Select" value="Select" />
                    <Picker.Item label="Yes" value="Yes" />
                    <Picker.Item label="No" value="No" />
                  </Picker>

                  <Text style={{ fontSize: 15, paddingTop: 25, paddingLeft: 5, paddingBottom: 10, color: colors.deepBlue, fontWeight: 500 }}>Change Account Status</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{ fontSize: 12, paddingLeft: 5 }}>Current Status :</Text>
                    <Text style={{ paddingBottom: 10, fontSize: 12, paddingLeft: 5 }}>{personalInfo.personalInfo.data.accountStatus}</Text>
                  </View>
                  <View>
                    <TouchableOpacity style={{ height: 30, width: '100%', borderRadius: 100, flexDirection: 'row', alignItems: 'center', paddingLeft: 5, }}
                      onPress={selectRadio1}
                    >
                      <View style={{ height: 20, width: 20, borderRadius: 50, backgroundColor: '#a5cfed', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ height: 10, width: 10, borderRadius: 50, backgroundColor: `${radio1Color}` }}>
                        </View>
                      </View>
                      <Text style={{ paddingLeft: 10, fontSize: 15, fontWeight: 500 }}>Active</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ height: 30, width: '100%', borderRadius: 100, flexDirection: 'row', alignItems: 'center', paddingLeft: 5, }}
                      onPress={selectRadio2}
                    >
                      <View style={{ height: 20, width: 20, borderRadius: 50, backgroundColor: '#a5cfed', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ height: 10, width: 10, borderRadius: 50, backgroundColor: `${radio2Color}` }}>
                        </View>
                      </View>
                      <Text style={{ paddingLeft: 10, fontSize: 15, fontWeight: 500 }}>Inactive</Text>
                    </TouchableOpacity>
                  </View>

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
                <ScrollView style={{ paddingHorizontal: 45, paddingBottom: 0 }}>
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

                  <View>
                    <Text style={{ color: colors.deepBlue, paddingTop: 15, fontSize: 15 }}>
                      Location
                    </Text>

                    <Text style={{ paddingTop: 5 }}>
                      {personalInfo.personalInfo.data.location}
                    </Text>
                  </View>

                  <View>
                    <Text style={{ color: colors.deepBlue, paddingTop: 15, fontSize: 15 }}>
                      Categories
                    </Text>

                    <Text style={{ paddingTop: 5 }}>
                      {personalInfo.personalInfo.data.allSelectedCategory.join(', ')}
                    </Text>
                  </View>

                  <View>
                    <Text style={{ color: colors.deepBlue, paddingTop: 15, fontSize: 15 }}>
                      Working Days
                    </Text>

                    <Text style={{ paddingTop: 5 }}>
                      {personalInfo.personalInfo.data.allSelectedWorkingDays.join(', ')}
                    </Text>
                  </View>

                  <View>
                    <Text style={{ color: colors.deepBlue, paddingTop: 15, fontSize: 15 }}>
                      Description
                    </Text>

                    <Text style={{ paddingTop: 5 }}>
                      {personalInfo.personalInfo.data.description}
                    </Text>
                  </View>

                  <View>
                    <Text style={{ color: colors.deepBlue, paddingTop: 15, fontSize: 15 }}>
                      Food Services?
                    </Text>

                    <Text style={{ paddingTop: 5 }}>
                      {personalInfo.personalInfo.data.food}
                    </Text>
                  </View>

                  <View>
                    <Text style={{ color: colors.deepBlue, paddingTop: 15, fontSize: 15 }}>
                      Start time of working hours
                    </Text>

                    <Text style={{ paddingTop: 5 }}>
                      {personalInfo.personalInfo.data.fromWorkingHours}
                    </Text>
                  </View>

                  <View>
                    <Text style={{ color: colors.deepBlue, paddingTop: 15, fontSize: 15 }}>
                      End time of working hours
                    </Text>

                    <Text style={{ paddingTop: 5 }}>
                      {personalInfo.personalInfo.data.toWorkingHours}
                    </Text>
                  </View>

                  <View>
                    <Text style={{ color: colors.deepBlue, paddingTop: 15, fontSize: 15 }}>
                      Highest Price
                    </Text>

                    <Text style={{ paddingTop: 5 }}>
                      {personalInfo.personalInfo.data.highPrice}
                    </Text>
                  </View>

                  <View>
                    <Text style={{ color: colors.deepBlue, paddingTop: 15, fontSize: 15 }}>
                      Least Price
                    </Text>

                    <Text style={{ paddingTop: 5, }}>
                      {personalInfo.personalInfo.data.leastPrice}
                    </Text>
                  </View>
                </ScrollView>
              </View>
          }
        </View>
      </View>

      <TouchableOpacity
        style={{ height: 45, width: 45, borderRadius: 10, backgroundColor: colors.deepViolet, position: 'absolute', top: '65%', marginLeft: 5, alignItems: 'center', justifyContent: 'center', elevation: 15, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15, shadowOffset: { width: 0, height: 2, } }}
        onPress={() => setEdit(!edit)}
      >
        <Entypo name="brush" size={22} color={colors.buttonTextColor} />
      </TouchableOpacity>
    </View>
  )
}