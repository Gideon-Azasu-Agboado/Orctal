import { View, Text, Image, ImageBackground, TextInput, TouchableOpacity, ActivityIndicator, ScrollView as RNScrollView } from 'react-native'
import { ScrollView } from 'react-native-virtualized-view';
import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig'
import { getFirestore, collection, query, getDocs, onSnapshot, where } from "firebase/firestore";
const db = getFirestore(app);
import { useUser } from '@clerk/clerk-expo';


import colors from '../../utils/colors'
import EventHostCard from '../components/EventHostCard';
import Header from '../components/Header';
const HeroImage = require("../../assets/images/Hero.jpg")
const Search = require("../../assets/images/search.png")
const Weddings = require("../../assets/images/weddings.jpg")
const Parties = require("../../assets/images/parties.jpg")
const Business = require("../../assets/images/business.jpg")
const Funeral = require("../../assets/images/funeral.jpg")
const Others = require("../../assets/images/others.jpg")


export default function Home({ navigation }) {
  const user = useUser();

  const [allEventHosts, setallEventHosts] = useState([])
  const [dataCheck, setdataCheck] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    getAllEventHosts()
  }, [])

  const getAllEventHosts = async () => {
    setallEventHosts([]);
    const q = query(collection(db, "users", "ujfSur6BjvCqnOhbsZVV", "AllEventHosts"));
    const unsuscribe = await onSnapshot(q, (querySnapshot) => {
      const tempAllEventHosts = [];

      querySnapshot.forEach((doc) => {
        if (querySnapshot.size === 0) {
          setTimeout(() => {
            setLoading(false)
            setdataCheck(false)
          }, 3000);
        } else {
          setLoading(false)
          setdataCheck(true)
          tempAllEventHosts.push({ eventhostdata: doc.data(), docid: doc.id })
        }
        setallEventHosts(tempAllEventHosts)
      })
    });
  }

  const handleRefresh = () => {
    setRefreshing(true)
    getAllEventHosts()
    setRefreshing(false)
  }
  // console.log('allEventHosts')
  // console.log(allEventHosts)

  return (
    <View style={{ paddingTop: 60, }}>
      <Header />
      <ScrollView style={{}}>
        <View style={{ paddingBottom: 40, paddingLeft: 10, paddingRight: 5 }}>
          <ImageBackground
            source={HeroImage}
            style={{ height: 200, width: "100%", marginTop: 20 }}
            imageStyle={{ borderRadius: 30 }}
          >
            <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 30, padding: 20 }}>
              <Text style={{ color: colors.buttonTextColor, zIndex: 10, paddingTop: 30, fontSize: 16, fontWeight: 700, paddingRight: 40, lineHeight: 22, }}>
                Search, scroll, browse through our
                listed categories and options and
                find your next working partner
              </Text>

              <View style={{ height: 45, width: '100%', backgroundColor: colors.buttonTextColor, borderRadius: 100, marginTop: 25, paddingLeft: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TextInput
                  style={{ height: 45, width: '80%', borderRadius: 100 }}
                  placeholder='Search...'
                />
                <TouchableOpacity style={{ height: 45, width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    source={Search}
                    style={{ height: 25, width: 25 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          <Text style={{ paddingTop: 40, paddingLeft: 15, fontSize: 16, fontWeight: 700, color: colors.deepBlue }}>
            Categories
          </Text>

          <View style={{ marginTop: 20, marginLeft: 10 }}>
            <RNScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <TouchableOpacity
                style={{ height: 120, width: 118, backgroundColor: colors.deepViolet, borderRadius: 20, elevation: 10, marginRight: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 2,} }}
                onPress={() => navigation.navigate('Categories', { categoryType: 'Weddings' })}
              >
                <Image
                  source={Weddings}
                  style={{ width: 118, height: 80, borderRadius: 20 }}
                />
                <Text style={{ color: colors.buttonTextColor, textAlign: 'center', paddingTop: 9 }}>
                  Weddings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ height: 120, width: 118, backgroundColor: '#3b256b', borderRadius: 20, elevation: 10, marginRight: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 2,} }}
                onPress={() => navigation.navigate('Categories', { categoryType: 'Funeral' })}
              >
                <Image
                  source={Funeral}
                  style={{ width: 118, height: 80, borderRadius: 20 }}
                />
                <Text style={{ color: colors.buttonTextColor, textAlign: 'center', paddingTop: 9 }}>
                  Funerals
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ height: 120, width: 118, backgroundColor: '#3b256b', borderRadius: 20, elevation: 10, marginRight: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 2,} }}
                onPress={() => navigation.navigate('Categories', { categoryType: 'Business Meetings' })}
              >
                <Image
                  source={Business}
                  style={{ width: 118, height: 80, borderRadius: 20 }}
                />
                <Text style={{ color: colors.buttonTextColor, textAlign: 'center', paddingTop: 1 }}>
                  Business Meetings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ height: 120, width: 118, backgroundColor: '#3b256b', borderRadius: 20, elevation: 10, marginRight: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 2,} }}
                onPress={() => navigation.navigate('Categories', { categoryType: 'Parties' })}
              >
                <Image
                  source={Parties}
                  style={{ width: 118, height: 80, borderRadius: 20 }}
                />
                <Text style={{ color: colors.buttonTextColor, textAlign: 'center', paddingTop: 9 }}>
                  Parties
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ height: 120, width: 118, backgroundColor: '#3b256b', borderRadius: 20, elevation: 10, marginRight: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 2,} }}
                onPress={() => navigation.navigate('Categories', { categoryType: 'Others' })}
              >
                <Image
                  source={Others}
                  style={{ width: 118, height: 80, borderRadius: 20 }}
                />
                <Text style={{ color: colors.buttonTextColor, textAlign: 'center', paddingTop: 9 }}>
                  Others
                </Text>
              </TouchableOpacity>
            </RNScrollView>
          </View>
        </View>

        <View style={{ paddingLeft: 10, paddingRight: 5, backgroundColor: colors.deepViolet, borderTopRightRadius: 40, borderTopLeftRadius: 40, marginTop: 10 }}>
          <Text style={{ paddingTop: 60, paddingLeft: 15, fontSize: 16, fontWeight: 700, color: colors.buttonTextColor }}>
            Event Centers
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

                <EventHostCard categoryList={allEventHosts} style={{ marginTop: 30, marginBottom: 40 }} refreshing={refreshing} handleRefresh={handleRefresh}/>
          }
        </View>
      </ScrollView>
    </View>
  )
}