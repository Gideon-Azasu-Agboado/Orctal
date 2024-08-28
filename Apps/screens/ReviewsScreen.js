import { View, Text } from 'react-native'
import { ScrollView } from 'react-native-virtualized-view';

import React from 'react'

import colors from '../../utils/colors'
import ReviewsCard from '../components/ReviewsCard'

export default function ReviewsScreen() {
    return (
        <View style={{ flex: 1, paddingTop: 60, backgroundColor: colors.buttonTextColor, }}>
            <ScrollView style={{ paddingHorizontal: 10, }}>
                <Text style={{ color: colors.deepViolet, fontSize: 16, fontWeight: 500, marginLeft: 10, paddingTop: 30, marginBottom: 30 }}>
                    ReviewsScreen
                </Text>

                <ReviewsCard/>
            </ScrollView>
        </View>
    )
}