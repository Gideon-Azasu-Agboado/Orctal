import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig'
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
const db = getFirestore(app);

import colors from '../../utils/colors'
import EventHostCard from '../components/EventHostCard';
import EventPlannerCard from '../components/EventPlannerCard';
import Header from '../components/Header';
import CustomTopTab from '../components/CustomTopTab';

export default function Favorites() {
  const [EventHosts, setEventHosts] = useState(null)
  const [EventPlanners, setEventPlanners] = useState(null)
  const [dataCheck, setdataCheck] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab1, setTab1] = useState(true)
  const [tab2, setTab2] = useState(false)
  const [refreshing, setRefreshing] = useState(false);

  const toggleActiveTab1 = () => {
    setTab1(true)
    setTab2(false);
  };

  const toggleActiveTab2 = () => {
    setTab1(false)
    setTab2(true);
  };

  useEffect(() => {
    getAllFavoritesEventHosts();
    getAllFavoritesEventPlanners();
  }, [])

  const getAllFavoritesEventHosts = async () => {
    setEventHosts([]);
    const q = query(collection(db, "users", "ujfSur6BjvCqnOhbsZVV", "AllEventHosts"), where("isFavorites", "==", true));
    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      const tempAllEventHosts = [];

      querySnapshot.forEach((doc) => {
        tempAllEventHosts.push({ eventhostdata: doc.data(), docid: doc.id })
        setLoading(false)
        setEventHosts(tempAllEventHosts)
      })
    }
    );
  }

  const getAllFavoritesEventPlanners = async () => {
    setEventPlanners([]);
    const q = query(collection(db, "users", "ujfSur6BjvCqnOhbsZVV", "AllEventPlanners"), where("isFavorites", "==", true));
    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      const tempAllEventPlanners = [];

      querySnapshot.forEach((doc) => {
        tempAllEventPlanners.push({ eventplannerdata: doc.data(), docid: doc.id })
        setLoading(false)
        setEventPlanners(tempAllEventPlanners)
      })
    }
    );
  }

  const handleRefresh = () => {
    setRefreshing(true)
    getAllFavoritesEvents()
    setRefreshing(false)
  }


  return (
    <View style={{ paddingTop: 60, }}>
      <Header />

      <View style={{ paddingLeft: 10, paddingRight: 5, marginTop: 20 }}>
        <Text style={{ paddingLeft: 15, fontSize: 16, fontWeight: 700, color: colors.deepBlue }}>
          Favorites
        </Text>

        <CustomTopTab tab1={tab1} tab2={tab2} toggleActiveTab2={toggleActiveTab2} toggleActiveTab1={toggleActiveTab1} TabOne='Event hosts' TabTwo='Event planners' style={{ marginTop: 60 }} />

        {
          tab1 && (
            <View>
              {
                loading
                  ?
                  <View style={{ alignItems: 'center', paddingTop: 30, paddingBottom: 30 }}>
                    <View style={{ height: 35, width: 35, elevation: 1, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.deepBlue, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 1, shadowOffset: { width: 0, height: 2,} }}>
                      <ActivityIndicator size='small' color={colors.buttonTextColor} />
                    </View>
                  </View>
                  :
                    <EventHostCard categoryList={EventHosts} refreshing={refreshing} handleRefresh={handleRefresh}/>
              }
            </View>
          )}
        {
          tab2 && (
            <View>
              {
                loading
                  ?
                  <View style={{ alignItems: 'center', paddingTop: 30, paddingBottom: 30 }}>
                    <View style={{ height: 35, width: 35, elevation: 1, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.deepBlue, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 1, shadowOffset: { width: 0, height: 2,} }}>
                      <ActivityIndicator size='small' color={colors.buttonTextColor} />
                    </View>
                  </View>
                  :
                  <EventPlannerCard categoryList={EventPlanners} />
              }
            </View>
          )}
      </View>
    </View>
  )
}