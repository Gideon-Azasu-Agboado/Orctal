import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React from 'react'
import { app } from '../../firebaseConfig'
import { getFirestore, doc, updateDoc, } from "firebase/firestore";
const db = getFirestore(app);
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons/';


import colors from '../../utils/colors'
const Parties = require("../../assets/images/parties.jpg")

export default function EventPlannerCard({ categoryList }) {
    // console.log(categoryList)
    const navigation = useNavigation();

       const changeFavoriesState = async (documentId, isFavorites) => {
        if (isFavorites === false) {
            const eventPlannerRef = doc(db, "users", "ujfSur6BjvCqnOhbsZVV", "AllEventPlanners", documentId);
            try {
                await updateDoc(eventPlannerRef, {
                    isFavorites: true
                });
            } catch (error) {
                console.log('Error updating document:', error);
            }
        } else {
            const eventPlannerRef = doc(db, "users", "ujfSur6BjvCqnOhbsZVV", "AllEventPlanners", documentId);
            try {
                await updateDoc(eventPlannerRef, {
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
            renderItem={({ item, index }) => (
                <TouchableOpacity 
                style={{ backgroundColor: colors.deepViolet, paddingTop: 20, paddingBottom: 5, width: '100%', borderRadius: 20, elevation: 10, paddingHorizontal: 10, marginTop: 35, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 2,} }}
                onPress={() => navigation.navigate('EventPlannerSection', {name: item.name, emailAddress: item.emailAddress, description: item.description, highPrice: item.highPrice, leastPrice: item.leastPrice, location: item.location, phone: item.phone, uploadedImages: item.uploadedImages})}
                >
                    <TouchableOpacity
                        style={{ height: 40, width: 40, backgroundColor: colors.buttonTextColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end', elevation: 5, zIndex: 10, marginRight: 10 , shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2,} }}
                        onPress={() => changeFavoriesState(item.docid, item.eventplannerdata.isFavorites)}
                    >
                        <AntDesign name="heart" size={18} color={item.eventplannerdata.isFavorites ? 'red' : '#ffc9bb'} />
                    </TouchableOpacity>

                    <View style={{ height: 95, width: '100%', paddingBottom: 20, paddingTop: 50 }}>
                        <Text style={{ color: colors.lighterBlue, fontSize: 20, textAlign: 'right', paddingRight: 10 }}>
                            {item.name}
                        </Text>
                    </View>
                    <View style={{ height: 125, width: '100%', backgroundColor: colors.lightWhite, borderRadius: 20 }}>
                        <View style={{ backgroundColor: colors.buttonTextColor, height: 70, width: 70, borderRadius: 100, elevation: 10, top: -35, marginLeft: 10, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 2,} }}>
                            <Image
                            source={{ uri: item.eventplannerdata?.uploadedImages }} 
                            style={{height: 60, width: 60, borderRadius: 100, justifyContent: 'center', alignItems: 'center'}}
                            />
                        </View>
                        <Text
                            style={{ fontSize: 15, paddingLeft: 20, top: -20, paddingRight: 20 }}
                            numberOfLines={3}
                            ellipsizeMode='tail'
                        >
                            {item.eventplannerdata.description}
                        </Text>
                    </View>
                </TouchableOpacity>
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