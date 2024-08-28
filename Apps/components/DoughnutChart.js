import { View, Text } from 'react-native'
import React from 'react'
import PieChart from 'react-native-pie-chart'
import colors from '../../utils/colors'

export default function DoughnutChart({ ActiveCount, CancelledCount, CompletedCount }) {
    const widthAndHeight = 80
    const series = [ActiveCount, CompletedCount, CancelledCount]
    const sliceColor = [colors.SatinSheenGold, colors.lightBlue, colors.russianViolet]

    return (
        <View style={{ alignItems: 'center' }}>
            <Text style={{ color: colors.lightBlue, fontSize: 15 }}>
                Bookings Status
            </Text>

            <View style={{ marginTop: 20 }}>
                <PieChart
                    widthAndHeight={widthAndHeight}
                    series={series}
                    sliceColor={sliceColor}
                    coverRadius={0.75}
                    coverFill={null}
                />
            </View>

            <View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <View style={{ height: 10, width: 10, borderRadius: 50, backgroundColor: colors.SatinSheenGold }} />
                        <Text style={{ color: colors.lightWhite, marginLeft: 5, fontSize: 12 }}>
                            Active
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: 15 }}>
                        <View style={{ height: 10, width: 10, borderRadius: 50, backgroundColor: colors.lightBlue }} />
                        <Text style={{ color: colors.lightWhite, marginLeft: 5, fontSize: 12 }}>
                            Completed
                        </Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <View style={{ height: 10, width: 10, borderRadius: 50, backgroundColor: colors.russianViolet }} />
                    <Text style={{ color: colors.lightWhite, marginLeft: 5, fontSize: 12 }}>
                        Cancelled
                    </Text>
                </View>
            </View>
        </View>
    )
}