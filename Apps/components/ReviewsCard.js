import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig'
import { getFirestore, query, where, onSnapshot, collection } from "firebase/firestore";
const db = getFirestore(app);
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';

import colors from '../../utils/colors'

export default function ReviewsCard() {
    const route = useRoute();
    const {name} = route.params
    // console.log(route.params)

    const personalInfo = useSelector((state) => state.personalInfo);

    const [userReviews, setUserReviews] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userReviewsArray = []
        const q = query(collection(db, "userReviews"), where("receiver", "==", name));

        const unsuscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                userReviewsArray.push({
                    docid: doc.id,
                    userReviewsData: doc.data()
                })
                setLoading(false)
                setUserReviews(userReviewsArray)
            })
        });
    }, [])

    // console.log(userReviews)

    return (
        <FlatList
            data={userReviews}
            renderItem={({ item, index }) => (
                <View>
                    <View style={{ width: '100%', borderRadius: 20, marginTop: 20, marginBottom: 20, borderLeftColor: colors.lightBlue, borderLeftWidth: 4, padding: 20, paddingTop: 40, backgroundColor: colors.buttonTextColor, elevation: 15, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15, shadowOffset: { width: 0, height: 2, } }}>
                        <Text style={{ color: colors.deepViolet, fontWeight: 500, fontSize: 16 }}>
                            {item.userReviewsData.sender}
                        </Text>
                        <View style={{ backgroundColor: colors.lightWhite, padding: 20, borderRadius: 20, marginTop: 20 }}>
                            <Text style={{ fontSize: 14, paddingRight: 50, }}>
                                {item.userReviewsData.message}
                            </Text>
                        </View>
                    </View>
                </View>
            )}
            keyExtractor={(item) => item.docid}
            ListEmptyComponent={
                <View>
                    <Text style={{ paddingTop: 70, fontSize: 15, textAlign: 'center'}}>
                        No reviews to display.
                    </Text>
                </View>
            }
        />
    )
}