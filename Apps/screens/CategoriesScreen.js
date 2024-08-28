import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig'
import { getFirestore, collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
const db = getFirestore(app);
import { FontAwesome6 } from '@expo/vector-icons';

import colors from '../../utils/colors'
import EventHostCard from '../components/EventHostCard';

export default function Categories({ navigation, route }) {
  const [weddingCategory, setWeddingCategory] = useState([])
  const [dataCheck, setdataCheck] = useState(false)
  const [loading, setLoading] = useState(true)

  const { categoryType } = route.params;

  useEffect(() => {
    getWeddingCategories()
  }, [])

  const getWeddingCategories = async () => {
    setWeddingCategory([]);
    const q = query(collection(db, "users", "ujfSur6BjvCqnOhbsZVV", "AllEventHosts"), where("allSelectedCategory", "array-contains", categoryType));
    const unsuscribe = await onSnapshot(q, (querySnapshot) => {
      const tempAllEventHosts = [];

      querySnapshot.forEach((doc) => {
        if(querySnapshot.size === 0){
          setTimeout(() => {
            setLoading(false)
            setdataCheck(false)
          }, 3000);
        } else{
          setLoading(false)
          setdataCheck(true)
          tempAllEventHosts.push({eventhostdata: doc.data(), docid: doc.id})
        }
        setWeddingCategory(tempAllEventHosts)
      })
    }
    );
  }

  return (
    <View>
      <View style={{ paddingLeft: 10, paddingRight: 5, paddingBottom: 25, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingTop: 70,  }}>
        <View style={{height: 40, width: 40, borderRadius: 100, backgroundColor: colors.lighterBlue, justifyContent: 'center', alignItems: 'center', marginRight: 10}}>
        <FontAwesome6 name="building-columns" size={16} color={colors.deepBlue} />
        </View>
        <Text style={{ fontSize: 19, fontWeight: 500, textAlign: 'center' }}>
          {categoryType}
        </Text>
      </View>

      {
        loading
          ?
          <View style={{  alignItems: 'center' , paddingTop: 30}}>
            <View style={{ height: 35, width: 35, elevation: 1, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.deepBlue, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 1, shadowOffset: { width: 0, height: 2,} }}>
              <ActivityIndicator size='small' color={colors.buttonTextColor} />
            </View>
          </View>
          :
          dataCheck
            ?
              <EventHostCard categoryList={weddingCategory} style={{ marginBottom: 120}}/>
            :
            <View style={{ alignItems: 'center', top: '50%', }}>
              <Text style={{ paddingTop: 70, fontSize: 15, }}>
                No data to display. Try refreshing page.
              </Text>

              <Text style={{ paddingTop: 15, fontSize: 15, }}>
                Or
              </Text>

              <TouchableOpacity
                style={{ marginTop: 20, width: '50%', height: 50, borderWidth: 1, borderColor: colors.deepBlue, borderRadius: 10, elevation: 5, backgroundColor: colors.buttonTextColor, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2,} }}
                onPress={() => navigation.goBack()}
              >
                <Text style={{ fontSize: 16, fontWeight: 500 }}>
                  Back to Home
                </Text>
              </TouchableOpacity>
            </View>
      }
    </View>
  )
}