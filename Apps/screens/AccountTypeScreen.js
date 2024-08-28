import { View, Text, ImageBackground, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'

import colors from '../../utils/colors'
const OrctalBg = require("../../assets/images/Orctal new bg.png")
const OrctalLogo = require("../../assets/images/Orctal logo.png")
import GradientText from '../components/GradientText';

export default function AccountTypeScreen({ navigation }) {
    const [loading, setLoading] = useState(false)
    const [selectedValue, setSelectedValue] = useState('');
    const [radio1Color, setRadio1Color] = useState('#DFD9D9')
    const [radio2Color, setRadio2Color] = useState('#DFD9D9')
    const [radio3Color, setRadio3Color] = useState('#DFD9D9')
    const [check, setCheck] = useState(false)

    const onPressCheck = () => {
        if(check === true){
            navigation.navigate(selectedValue)
        }
    }


    const selectRadio1 = () => {
        setSelectedValue('BookerRegister')
        setRadio1Color('#967979')
        setRadio2Color('#DFD9D9')
        setRadio3Color('#DFD9D9')
        setCheck(true)
    }

    const selectRadio2 = () => {
        setSelectedValue('EventHostRegisterDetails')
        setRadio1Color('#DFD9D9')
        setRadio2Color('#967979')
        setRadio3Color('#DFD9D9')
        setCheck(true)
    }

    const selectRadio3 = () => {
        setSelectedValue('EventPlannerRegisterDetails')
        setRadio1Color('#DFD9D9')
        setRadio2Color('#DFD9D9')
        setRadio3Color('#967979')
        setCheck(true)
    }


    return (
        <ImageBackground source={OrctalBg} style={{ flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 100 }}>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <GradientText text='Choose Account Type' style={{ fontWeight: '700', fontSize: 25, }} />

                <View style={{ height: 75, width: 75, backgroundColor: colors.lighterBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center', marginTop: 40, zIndex: 1, elevation: 2, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 2,} }}>
                    <View style={{ height: 65, width: 65, backgroundColor: colors.lightBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={OrctalLogo} style={{ width: 45, height: 45 }} />
                    </View>
                </View>

                <View style={{ backgroundColor: colors.buttonTextColor, padding: 20, paddingTop: 80, width: '100%', borderRadius: 30, marginTop: -30 }}>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={{ backgroundColor: colors.buttonTextColor, height: 50, width: '100%', borderRadius: 100, flexDirection: 'row', alignItems: 'center', padding: 10, paddingLeft: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2,} }}
                            onPress={selectRadio1}
                        >
                            <View style={{ height: 20, width: 20, borderRadius: 50, backgroundColor: '#DFD9D9', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ height: 10, width: 10, borderRadius: 50, backgroundColor: `${radio1Color}` }}>
                                </View>
                            </View>
                            <Text style={{ paddingLeft: 10, fontSize: 15, fontWeight: 500 }}>Booker</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ backgroundColor: colors.buttonTextColor, height: 50, width: '100%', borderRadius: 100, flexDirection: 'row', alignItems: 'center', padding: 10, paddingLeft: 20, elevation: 5, marginTop: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2,} }}
                            onPress={selectRadio2}
                        >
                            <View style={{ height: 20, width: 20, borderRadius: 50, backgroundColor: '#DFD9D9', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ height: 10, width: 10, borderRadius: 50, backgroundColor: `${radio2Color}` }}>
                                </View>
                            </View>
                            <Text style={{ paddingLeft: 10, fontSize: 15, fontWeight: 500 }}>Event Host</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ backgroundColor: colors.buttonTextColor, height: 50, width: '100%', borderRadius: 100, flexDirection: 'row', alignItems: 'center', padding: 10, paddingLeft: 20, elevation: 5, marginTop: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 2,} }}
                            onPress={selectRadio3}
                        >
                            <View style={{ height: 20, width: 20, borderRadius: 50, backgroundColor: '#DFD9D9', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ height: 10, width: 10, borderRadius: 50, backgroundColor: `${radio3Color}` }}>
                                </View>
                            </View>
                            <Text style={{ paddingLeft: 10, fontSize: 15, fontWeight: 500 }}>Event Planner</Text>
                        </TouchableOpacity>
                    </View>

                    {
                        check
                        ?
                        <TouchableOpacity
                        style={{ backgroundColor: colors.lightBlue, width: '100%', height: 60, justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 40, borderRadius: 100, }}>
                        <TouchableOpacity
                            style={{ width: '95%', height: 50, backgroundColor: colors.buttonColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center', display: 'flex' }}
                            onPress={() => onPressCheck()}
                        >
                            {
                                loading
                                    ?
                                    <ActivityIndicator size='small' color='#ffffff' />
                                    :
                                    <Text style={{ color: colors.buttonTextColor, fontSize: 16, textAlign: 'center' }}>
                                        Next
                                    </Text>
                            }
                        </TouchableOpacity>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={{ backgroundColor: colors.lightBlue, width: '100%', height: 60, justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 40, borderRadius: 100, }}
                        activeOpacity={1}
                        >
                        <TouchableOpacity
                            style={{ width: '95%', height: 50, backgroundColor: colors.buttonColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center', display: 'flex' }}
                            onPress={() => onPressCheck()}
                            activeOpacity={1}
                        >
                            {
                                loading
                                    ?
                                    <ActivityIndicator size='small' color='#ffffff' />
                                    :
                                    <Text style={{ color: colors.buttonTextColor, fontSize: 16, textAlign: 'center' }}>
                                        Next
                                    </Text>
                            }
                        </TouchableOpacity>
                    </TouchableOpacity>
                    }

                </View>
            </View>
        </ImageBackground>
    )
}