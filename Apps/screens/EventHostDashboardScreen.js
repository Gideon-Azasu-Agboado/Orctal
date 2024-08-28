import { View, Text, Image, ImageBackground, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig'
import { useNavigation } from '@react-navigation/native';
const db = getFirestore(app);
import { getFirestore, query, onSnapshot, collection } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';

import colors from '../../utils/colors'
import DoughnutChart from '../components/DoughnutChart'
import BarChart from '../components/CustomBarChart';
const Hero = require("../../assets/images/Hero.jpg")
const appointmentCircle = require("../../assets/images/Appointment circle.png")
const ratingsStar = require("../../assets/images/ratingsStar.png")
const Left = require("../../assets/images/left.png")

export default function EventHostDashboardScreen() {
  const navigation = useNavigation()
  const personalInfo = useSelector((state) => state.personalInfo);
  const bookingsData = useSelector((state) => state.bookingsData);

  const [appointmentsCountz, setAppointmentsCountz] = useState(0)
  const [bookersCount, setBookersCount] = useState(0)
  const [yaxisData, setYAxisData] = useState()
  const [activeCount, setActiveCount] = useState(0)
  const [cancelledCount, setCancelledCount] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)


  useEffect(() => {
    countAppointmentsAndBookers()
  }, [])

  const countAppointmentsAndBookers = () => {
    const totalAppointments = bookingsData.bookingsData.filter((appointment) => (
      appointment.data.eventHostName === personalInfo.personalInfo.data.name
    ))

    // console.log(totalAppointments)

    const bookers = []
    let yAxis = []
    let weddingsCount = null;
    let FuneralsCount = null;
    let PartiesCount = null;
    let BusinessMeetingsCount = null;
    let OthersCount = null;
    let ActiveCount = 0;
    let CompletedCount = 0;
    let CancelledCount = 0;

    totalAppointments.forEach((booker) => {
      if (!bookers.includes(booker.data.BookerId)) {
        bookers.push(booker.data.BookerId)
      }

      if(booker.data.selectedOccasion === 'Weddings'){
        weddingsCount++
      } else if (booker.data.status === 'Funerals') {
        FuneralsCount++
      } else if (booker.data.status === 'Parties') {
        PartiesCount++
      } else if (booker.data.status === 'Business Meetings') {
        BusinessMeetingsCount++
      } else {
        OthersCount++
      }

      // switch (booker.data.selectedOccasion) {
      //   case 'Weddings':
      //     weddingsCount++
      //     break
      //   case 'Funerals':
      //     FuneralsCount++
      //     break
      //   case 'Parties':
      //     PartiesCount++
      //     break
      //   case 'Business Meetings':
      //     BusinessMeetingsCount++
      //     break
      //   case 'Others':
      //     OthersCount++
      //     break
      // }

      if(booker.data.status === 'Active'){
        ActiveCount++
      } else if (booker.data.status === 'Completed') {
        CompletedCount++
      } else {
        CancelledCount++
      }

      // switch (booker.data.status) {
      //   case 'Active':
      //     ActiveCount++
      //     break
      //   case 'Completed':
      //     CompletedCount++
      //     break
      //   case 'Cancelled':
      //     CancelledCount++
      //     break
      // }
    })

    yAxis.push({ value: weddingsCount }, { value: FuneralsCount }, { value: PartiesCount }, { value: BusinessMeetingsCount }, { value: OthersCount })
    const yAxisData = yAxis.filter((itemCount) => (
      itemCount.value != null
    ))

    // console.log(yAxisData)
    setAppointmentsCountz(totalAppointments.length)
    setBookersCount(bookers.length)
    setYAxisData(yAxisData)
    setActiveCount(ActiveCount)
    setCancelledCount(CancelledCount)
    setCompletedCount(CompletedCount)
  }
        // console.log(activeCount)


  const userRatingsCount = () => {
    let count = 0
    let total = 0

    personalInfo.personalInfo.data.userRatings.forEach((userRating) => {
      count = count + userRating
      total++
    })

    let average = count / total
    return [average, total]
  }

  const [average, total] = userRatingsCount();

  // console.log(bookingsData.bookingsData)
  // console.log('Resaults', activeCount)

  return (
    <View style={{ flex: 1, paddingTop: 40, backgroundColor: colors.buttonTextColor, }}>
      <ScrollView style={{ paddingHorizontal: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{ uri: personalInfo.personalInfo.data.uploadedImages.downloadURLs[0] }}
            style={{ height: 30, width: 30, borderRadius: 100 }}
          />
          <Text style={{ marginLeft: 10 }}>{personalInfo.personalInfo.data.name}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', paddingHorizontal: 10, marginTop: 20 }}>
          <View style={{ alignItems: 'center' }}>
            <ImageBackground
              source={appointmentCircle}
              style={{ height: 220, width: 220, justifyContent: 'center', alignItems: 'center' }}
            >
              <Text style={{ fontSize: 35, color: colors.deepBlue }}>
                {appointmentsCountz}
              </Text>
            </ImageBackground>
            <Text style={{ marginTop: -5 }}>Bookings</Text>
          </View>

          <View style={{ alignItems: 'center', alignSelf: 'center' }}>
            <View style={{ elevation: 15, height: 50, width: 50, borderRadius: 100, backgroundColor: colors.buttonTextColor, justifyContent: 'center', alignItems: 'center', shadowColor: '#3744c3', shadowOpacity: 0.2, shadowRadius: 15, shadowOffset: { width: 0, height: 2, } }}>
              <Text style={{ color: colors.SatinSheenGold, fontSize: 20 }}>
                {bookersCount}
              </Text>
            </View>
            <Text style={{ paddingTop: 10 }}>Bookers</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60 }}>
          <TouchableOpacity style={{ width: '60%', backgroundColor: colors.deepViolet, borderRadius: 30, padding: 20 }}>
            {
              activeCount === 0 && completedCount === 0 && cancelledCount === 0
              ?
              <Text style={{textAlign: 'center', color: colors.lightWhite}}>No data available</Text>
              :
              <DoughnutChart
              ActiveCount={activeCount}
              CompletedCount={completedCount}
              CancelledCount={cancelledCount}
            />
            }
          </TouchableOpacity>

          <View style={{ marginRight: 10 }}>
            <Text style={{ color: colors.deepViolet, fontWeight: 500, fontSize: 16, paddingBottom: 10 }}>
              Ratings
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: colors.SatinSheenGold, fontSize: 28 }}>
                {average}
              </Text>

              <Image
                source={ratingsStar}
                style={{ height: 17, width: 17, marginLeft: 7 }}
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ paddingTop: 1 }}>
                From
              </Text>
              <Text style={{ paddingTop: 1, paddingLeft: 4, color: colors.buttonColor, fontWeight: 500, fontSize: 20 }}>
                {total}
              </Text>
              <Text style={{ paddingTop: 1, paddingLeft: 4 }}>
                bookers
              </Text>
            </View>
          </View>
        </View>

        <View>
          <BarChart
            xAxisLabelTexts={personalInfo.personalInfo.data.allSelectedCategory}
            yAxisData={yaxisData}
          />
        </View>

        <TouchableOpacity
          style={{ borderRadius: 20, marginTop: 40, marginBottom: 20 }}
          onPress={() => navigation.navigate('Reviews', {name: personalInfo.personalInfo.data.name})}
        >
          <ImageBackground
            source={Hero}
            style={{ width: '100%', }}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: '70%', backgroundColor: colors.deepViolet, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 30 }}>
                <Text style={{ color: colors.lightBlue, fontSize: 16 }}>
                  Reviews
                </Text>

                <Text style={{ color: colors.lightWhite, marginTop: 20, lineHeight: 18, }}>
                  Get to know what people you have worked with are saying
                </Text>
              </View>

              <Image
                source={Left}
                style={{ transform: [{ rotate: '180deg' }], marginRight: 25, marginTop: 15 }} />
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}