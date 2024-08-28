import { View, Text, ImageBackground, Image, TouchableOpacity, ScrollView, Modal } from 'react-native'
import React, { useState } from 'react'

import colors from '../../utils/colors'
import GradientText from '../components/GradientText';
const OrctalBg = require("../../assets/images/Orctal new bg.png")
const OrctalLogo = require("../../assets/images/Orctal logo.png")
const Wave = require("../../assets/images/wave.png")


export default function StarterScreen({ navigation }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <ImageBackground source={OrctalBg} style={{ flex: 1, padding: 30 }}>
      <View style={{ paddingTop: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 20, fontWeight: '400' }}>Hi,</Text>
            <Image source={Wave} style={{ width: 30, height: 30 }} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '400' }}>there</Text>
        </View>

        <View style={{ height: 90, width: 90, backgroundColor: colors.lighterBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ height: 80, width: 80, backgroundColor: colors.lightBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={OrctalLogo} style={{ width: 60, height: 60 }} />
          </View>
        </View>
      </View>

      <View style={{ flex: 1, paddingTop: 160 }}>
        <GradientText text='Welcome to Orctal' style={{ fontWeight: '700', fontSize: 30, }} />

        <Text style={{ paddingTop: 40, fontSize: 15, lineHeight: 22,}}>
          Looking for where to host your next event or find a professional to guide in your decision making?
          We have got the right solutions for you. Just turn to us and let us relieve your burden. We will help you find what you are looking for
        </Text>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity 
          style={{ backgroundColor: colors.lightBlue, width: '100%', height: 70, justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 80, borderRadius: 100, }}
          classname='animate-pulse'
          >
            <TouchableOpacity
              style={{ width: '95%', height: 60, backgroundColor: colors.buttonColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center', display: 'flex' }}
              onPress={() => setShowModal(true)}
            >
              <Text style={{ color: colors.buttonTextColor, fontSize: 16, textAlign: 'center' }}>Let's get started</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        animationType='fade'
        transparent={true}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)', paddingTop: 80, width: '100%' }}>
          <View style={{ minHeight: '40%', backgroundColor: colors.buttonTextColor, borderTopRightRadius: 40, borderTopLeftRadius: 40, alignItems: 'center' }}>
            <View style={{ height: 5, width: 50, backgroundColor: colors.deepBlue, marginTop: 20, borderRadius: 50 }}></View>

            <Text style={{ fontSize: 18, paddingTop: 30, fontWeight: '700', color: colors.deepBlue }}>Don't have an account?</Text>

            <TouchableOpacity
              style={{ width: '50%', height: 50, backgroundColor: colors.SatinSheenGold, borderRadius: 100, justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 40 }}
              onPress={() => {navigation.navigate('CreateAccount'); setShowModal(false)}}
            >
              <Text style={{ color: colors.buttonTextColor }}>Sign Up Now</Text>
            </TouchableOpacity>

            <Text style={{ paddingTop: 10, textAlign: 'center', fontSize: 18 }}>Or</Text>

            <TouchableOpacity
              style={{ width: '50%', height: 50, backgroundColor: colors.lightBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 10 }}
              onPress={() => {navigation.navigate('Login'); setShowModal(false)}}
            >
              <Text style={{ color: colors.buttonTextColor }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  )
}