import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import colors from '../../utils/colors'
const CheckMark = require("../../assets/images/check-mark.png")

export default function CheckBox({ isChecked, label, index, onPress }) {
    return (
        <TouchableOpacity onPress={() => onPress(index)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                <View
                    style={{
                        height: 20,
                        width: 20,
                        borderColor: colors.lighterBlue,
                        borderWidth: 1,
                        borderRadius: 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                        marginTop: 7
                    }}
                >
                    {isChecked &&
                        <View style={{ height: 20, width: 20, backgroundColor: colors.lightBlue, borderRadius: 4, justifyContent: 'center', alignItems: 'center', }}>
                            <Image source={CheckMark}
                                style={{ height: 12, width: 12 }}
                            />
                        </View>
                    }
                </View>
                <Text>{label}</Text>
            </View>
        </TouchableOpacity>
    )
}