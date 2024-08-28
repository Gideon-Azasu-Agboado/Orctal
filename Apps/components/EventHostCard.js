import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons/';
import { useNavigation } from '@react-navigation/native';
import { app } from '../../firebaseConfig'
import { getFirestore, doc, updateDoc, } from "firebase/firestore";
const db = getFirestore(app);

import colors from '../../utils/colors'

export default function EventHostCard({ categoryList, style }) {
    const navigation = useNavigation();

    const changeFavoriesState = async (documentId, isFavorites) => {
        if (isFavorites === false) {
            const eventHostRef = doc(db, "users", "ujfSur6BjvCqnOhbsZVV", "AllEventHosts", documentId);
            try {
                await updateDoc(eventHostRef, {
                    isFavorites: true
                });
            } catch (error) {
                console.log('Error updating document:', error);
            }
        } else {
            const eventHostRef = doc(db, "users", "ujfSur6BjvCqnOhbsZVV", "AllEventHosts", documentId);
            try {
                await updateDoc(eventHostRef, {
                    isFavorites: false
                });
            } catch (error) {
                console.log('Error updating document:', error);
            }
        }
    }

    return (
        <FlatList
            data={categoryList}
            style={style}
            renderItem={({ item, index }) => (
                <View style={{ alignItems: 'flex-end', marginTop: 25, marginBottom: 25 }}>
                    {/* {console.log(item.eventhostdata.isFavorites)} */}
                    <TouchableOpacity
                        style={{ height: 40, width: 40, backgroundColor: colors.buttonTextColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center', elevation: 5, zIndex: 10, marginRight: 10 , shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2,} }}
                        onPress={() => changeFavoriesState(item.docid, item.eventhostdata.isFavorites)}
                    >
                        <AntDesign name="heart" size={18} color={item.eventhostdata.isFavorites ? 'red' : '#ffc9bb'} />
                    </TouchableOpacity>

                    <View
                        style={{ width: '100%', alignItems: 'center', paddingBottom: 30, marginTop: -55 }}
                    >
                        <Image
                            source={{ uri: item?.eventhostdata.uploadedImages.downloadURLs[0] }}
                            style={{ height: 250, width: '100%', borderRadius: 20 }}
                        />
                        <TouchableOpacity
                            style={{ backgroundColor: colors.buttonTextColor, width: '96%', height: 150, paddingBottom: 15, paddingTop: 20, paddingHorizontal: 30, borderRadius: 30, elevation: 5, marginTop: -70, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2,} }}
                            onPress={() => navigation.navigate('EventHostSection', { allSelectedCategory: item.eventhostdata.allSelectedCategory, allSelectedWorkingDays: item.eventhostdata.allSelectedWorkingDays, description: item.eventhostdata.description, emailAddress: item.eventhostdata.emailAddress, food: item.eventhostdata.food, fromWorkingHours: item.eventhostdata.fromWorkingHours, highPrice: item.eventhostdata.highPrice, leastPrice: item.eventhostdata.leastPrice, location: item.eventhostdata.location, name: item.eventhostdata.name, phone: item.eventhostdata.phone, toWorkingHours: item.eventhostdata.toWorkingHours, uploadedImages: item.eventhostdata.uploadedImages })}
                        >
                            <Text style={{ paddingTop: 10, fontSize: 17, fontWeight: 700, color: colors.deepBlue }}>
                                {item?.eventhostdata.name}
                            </Text>
                            <Text
                                style={{ paddingTop: 12, }}
                                numberOfLines={3}
                                ellipsizeMode="tail"
                            >
                                {item?.eventhostdata.description}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            keyExtractor={(item) => item.docid}
            ListEmptyComponent={
                <View>
                    <Text style={{ paddingTop: 70, fontSize: 15, textAlign: 'center' }}>
                        No data to display.
                    </Text>
                </View>
            }
        />
    )
}