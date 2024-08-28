import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function CustomTopTab({ TabOne, TabTwo, tab1, tab2, toggleActiveTab1, toggleActiveTab2, style }) {
    return (
        <View style={[ style, {justifyContent: 'center'} ]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
                <TouchableOpacity style={{ width: 120, height: 40, backgroundColor: tab1 ? '#85bae0' : 'transparent', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 5 }}
                    onPress={() => toggleActiveTab1()}
                >
                    <Text>
                        {TabOne}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: 120, height: 40, backgroundColor: tab2 ? '#85bae0' : 'transparent', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 6 }}
                    onPress={() => toggleActiveTab2()}
                >
                    <Text>
                        {TabTwo}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}