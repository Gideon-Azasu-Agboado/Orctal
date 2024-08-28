import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import colors from '../../utils/colors'
import CustomTopTab from '../components/CustomTopTab';
import HistoryCard from '../components/HistoryCard';

export default function EventHostHistoryScreen() {
    const bookingsData = useSelector((state) => state.bookingsData);
    const navigation = useNavigation();

    const [dataCheck, setdataCheck] = useState(false)
    const [loading, setLoading] = useState(true)
    const [tab1, setTab1] = useState(true)
    const [tab2, setTab2] = useState(false)

    const { bookingsData: data } = bookingsData;

    const activeBookings = data.filter((doc) => {
        return doc.data.status === 'Active' && doc.data.bookingType === 'Host'
    })

    const activeBookingsTotal = activeBookings.length

    const history = data.filter((doc) => {
        return doc.data.status !== 'Active' && doc.data.bookingType === 'Host'
    })

    const historyTotal = history.length

    // console.log(activeBookings)

    const toggleActiveTab1 = () => {
        setTab1(true)
        setTab2(false);
    };

    const toggleActiveTab2 = () => {
        setTab1(false)
        setTab2(true);
    };

    return (
        <View style={{ paddingTop: 60, }}>
            <View style={{ paddingLeft: 10, paddingRight: 5, marginTop: 20 }}>
                <Text style={{ paddingLeft: 15, fontSize: 16, fontWeight: 700, color: colors.deepBlue }}>
                    History
                </Text>

                <CustomTopTab
                    tab1={tab1}
                    tab2={tab2}
                    toggleActiveTab2={toggleActiveTab2}
                    toggleActiveTab1={toggleActiveTab1}
                    TabOne='Bookings'
                    TabTwo='History'
                    style={{ marginTop: 30 }}
                />

                {
                    <View style={{marginTop: 10}}>
                        {
                            tab1 && (
                                activeBookingsTotal < 1 ? (
                                    <View style={{ alignItems: 'center', top: '30%', }}>
                                    <Text style={{ paddingTop: 70, fontSize: 15, }}>
                                      No new bookings
                                    </Text>
                      
                                    <TouchableOpacity
                                      style={{ marginTop: 20, width: '50%', height: 50, borderWidth: 1, borderColor: colors.deepBlue, borderRadius: 10, elevation: 5, backgroundColor: colors.buttonTextColor, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2,} }}
                                      onPress={() => navigation.navigate('Home')}
                                    >
                                      <Text style={{ fontSize: 16, fontWeight: 500 }}>
                                        Back to Home
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                ) : (
                                    <HistoryCard bookingsData={activeBookings} />
                                )
                            )
                        }
                    </View>
                }
                {
                    <View>
                        {
                            tab2 && (
                                historyTotal < 1 ? (
                                    <View style={{ alignItems: 'center', top: '30%', }}>
                                    <Text style={{ paddingTop: 70, fontSize: 15, }}>
                                      No history
                                    </Text>
                      
                                    <TouchableOpacity
                                      style={{ marginTop: 20, width: '50%', height: 50, borderWidth: 1, borderColor: colors.deepBlue, borderRadius: 10, elevation: 5, backgroundColor: colors.buttonTextColor, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2,} }}
                                      onPress={() => navigation.navigate('Home')}
                                    >
                                      <Text style={{ fontSize: 16, fontWeight: 500 }}>
                                        Back to Home
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                ) : (
                                    <HistoryCard bookingsData={history} />
                                )
                            )
                        }
                    </View>
                }
            </View>
        </View>
    )
}