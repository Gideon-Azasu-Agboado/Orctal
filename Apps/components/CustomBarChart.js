import { View, Text } from 'react-native'
import React from 'react'
import { BarChart } from "react-native-gifted-charts";

import colors from '../../utils/colors'

export default function CustomBarChart({xAxisLabelTexts, yAxisData}) {
    return (
        // alphabetical sorting of labels
        <View>
            <Text style={{ color: colors.deepViolet, fontWeight: 500, fontSize: 16, paddingBottom: 20, paddingTop: 35, paddingLeft: 15 }}>
                Categories Activity
            </Text>
            <BarChart 
            data={yAxisData} 
            frontColor={colors.deepBlue} 
            isAnimated={true} roundedTop={true} 
            xAxisColor={colors.buttonColor} 
            yAxisColor={colors.buttonColor} 
            xAxisLabelTexts={xAxisLabelTexts}
            spacing={30}
            />
        </View>
    )
}