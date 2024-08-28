import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, withRepeat, useSharedValue, Easing } from 'react-native-reanimated';
import { app } from '../../firebaseConfig'
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
const db = getFirestore(app);
import { useUser } from '@clerk/clerk-expo';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { bookingsSlice } from '../../context/bookingsSlice';

import colors from '../../utils/colors';
const OrctalRedicrectBg = require("../../assets/images/Orctal redirect.jpg");
import { userDataSlice } from '../../context/userDataSlice';

export default function RedirectScreen() {
  const user = useUser();
  const dispatch = useDispatch();
  const personalInfo = useSelector((state) => state.personalInfo);
  const bookingsData = useSelector((state) => state.bookingsData);
  const navigation = useNavigation();

  const [status, setStatus] = useState(false);
  const [bookingStatus, setbookingStatus] = useState(false);


  useEffect(() => {
    const subcollectionNames = ['AllBookers', 'AllEventHosts', 'AllEventPlanners']

    subcollectionNames.forEach((subcollectionName) => {
      const subcollectionQuery = query(collection(db, "users", "ujfSur6BjvCqnOhbsZVV", subcollectionName), where("id", "==", user.user.id));

      const unsuscribe = onSnapshot(subcollectionQuery, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          dispatch(userDataSlice.actions.setUserData({
            docid: doc.id, data: doc.data()
          }));
        })

        setStatus(true);
      });
    })
  }, []);

  useEffect(() => {
      const bookingArray = []
      const q = query(collection(db, "BookerAndEventHostsBookingsLog"));
  
      const unsuscribe = onSnapshot(q, (querySnapshot) => {
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
      setbookingStatus(true);
      return () =>  unsuscribe();
  }, [bookingsData])

  useEffect(() => {
    if (status === true && personalInfo.personalInfo != null || undefined && bookingStatus=== true && bookingsData.bookingsData != null || undefined && personalInfo.personalInfo.data.accountType) {
      switch(personalInfo.personalInfo.data.accountType) {
        case 'Booker':
          navigation.replace('Home')
          break
        case 'Event Host':
          navigation.reset({
            index: 0,
            routes: [{ name: 'HostHome' }],
          });
          break
        case 'Event Planner':
          navigation.replace('EventPlannerDashboard')
          break
      }
    }
  }, [status, personalInfo, navigation, bookingStatus]);


  const translateX = useSharedValue(80);
  const duration = 1000

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-translateX.value, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      true
    )
  }, []);

  // console.log(bookingsData)


  return (
    <ImageBackground source={OrctalRedicrectBg} style={{ flex: 1, padding: 30 }}>
      <View style={{ top: '67%', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, color: colors.lighterBlue, textAlign: 'center' }}>
          A moment. Logging you in..
        </Text>

        <View style={{ marginTop: 30, height: 7, width: '70%', backgroundColor: colors.russianViolet, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
          <Animated.View style={[{ height: 7, width: 60, backgroundColor: colors.lighterBlue, borderRadius: 50, }, animatedStyle]} />
        </View>
      </View>
    </ImageBackground>
  );
}