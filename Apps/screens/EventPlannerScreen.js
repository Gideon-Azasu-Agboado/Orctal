import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig'
import { getFirestore, collection, query, getDocs, onSnapshot } from "firebase/firestore";
const db = getFirestore(app);
import { useUser } from '@clerk/clerk-expo';


import colors from '../../utils/colors'

import EventPlannerCard from '../components/EventPlannerCard';
import Header from '../components/Header';

export default function EventPlannerScreen() {
  const user = useUser();

  const [allEventPlanners, setallEventPlanners] = useState([])
  const [dataCheck, setdataCheck] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getallEventPlanners()
  }, [])

  const getallEventPlanners = async () => {
    setallEventPlanners([])
    const q = query(collection(db, "users", "ujfSur6BjvCqnOhbsZVV", "AllEventPlanners"));

    const unsuscribe = await onSnapshot(q, (querySnapshot) => {
      const tempAllEventPlanners = [];

      querySnapshot.forEach((doc) => {
        if (querySnapshot.size === 0) {
          setTimeout(() => {
            setLoading(false)
            setdataCheck(false)
          }, 3000);
        } else {
          setLoading(false)
          setdataCheck(true)
          tempAllEventPlanners.push({ eventplannerdata: doc.data(), docid: doc.id })
        }
        setallEventPlanners(tempAllEventPlanners)
      })
    });
  } 

  return (
    <View style={{ paddingTop: 30, justifyContent: 'center', paddingTop: 60, }}>
        <Header/>

        <View style={{ paddingLeft: 10, paddingRight: 5, marginTop: 20 }}>
          <Text style={{ paddingLeft: 15, fontSize: 16, fontWeight: 700, color: colors.deepBlue }}>
            Event Planners
          </Text>
          {
            loading
              ?
              <View style={{ alignItems: 'center', paddingTop: 30, paddingBottom: 30 }}>
                <View style={{ height: 35, width: 35, elevation: 1, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.deepBlue, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 1, shadowOffset: { width: 0, height: 2,} }}>
                  <ActivityIndicator size='small' color={colors.buttonTextColor} />
                </View>
              </View>
              :
              dataCheck
                ?
                <EventPlannerCard categoryList={allEventPlanners}/>
                :
                <Text style={{ paddingTop: 70, fontSize: 15, }}>
                  No data to display. Try refreshing page.
                </Text>
          }
        </View>
    </View>
  )
}