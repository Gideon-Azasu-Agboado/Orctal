import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig'
import { getFirestore, collection, query, getDocs, where, onSnapshot } from "firebase/firestore";
const db = getFirestore(app);
import { useUser } from '@clerk/clerk-expo';
import { useDispatch, useSelector } from 'react-redux';

import colors from '../../utils/colors'
const OrctalLogo = require("../../assets/images/Orctal logo.png")
import { userDataSlice } from '../../context/userDataSlice';
import { bookingsSlice } from '../../context/bookingsSlice';

export default function Header() {
  const user = useUser();
  const dispatch = useDispatch();
  const personalInfo = useSelector((state) => state.personalInfo);
  const bookingsData = useSelector((state) => state.bookingsData);

  // useEffect(() => {
  //     fetchBookibgsData();
  // }, []);

  // const fetchBookibgsData = async () => {
  //   const bookingArray = []
  //   const q = query(collection(db, "BookerAndEventHostsBookingsLog"));

  //   const unsuscribe = await onSnapshot(q, (querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       const bookingData = doc.data();
  //       const timeStamp = bookingData.timeStamp.toDate().toLocaleString();

  //       bookingArray.push({
  //         docid: doc.id, 
  //         data: {
  //         ...bookingData,
  //         timeStamp: timeStamp,
  //       },
  //       })
  //     })
  //     dispatch(bookingsSlice.actions.setBookingsData(bookingArray));
  //   });
  // }
 
 
 
  // console.log(bookingsData.bookingsData)

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, paddingLeft: 10, paddingRight: 5 }}>
      <View style={{ height: 55, width: 55, backgroundColor: colors.lighterBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 2,} }}>
        <View style={{ height: 45, width: 45, backgroundColor: colors.lightBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={OrctalLogo} style={{ width: 35, height: 35 }} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 30, borderRadius: 40 }}>
        <View style={{}}>
          <Text style={{ textAlign: 'right', fontWeight: 700, fontSize: 16 }}>
            Welcome.
          </Text>
          <Text style={{ color: colors.deepBlue }}>
            {personalInfo?.personalInfo?.data?.name}
          </Text>
        </View>

        <View style={{ height: 55, width: 55, backgroundColor: colors.lighterBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center', elevation: 2, marginLeft: 15, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 2,} }}>
          <Image
            source={{ uri: user.user.imageUrl }}
            style={{ height: 45, width: 45, borderRadius: 100, }}
          />
        </View>
      </View>
    </View>
  )
}