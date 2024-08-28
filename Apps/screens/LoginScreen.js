import { View, Text, ImageBackground, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useSignIn } from "@clerk/clerk-expo";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../utils/colors'
const OrctalBg = require("../../assets/images/Orctal new bg.png")
const OrctalLogo = require("../../assets/images/Orctal logo.png")
import GradientText from '../components/GradientText'

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigation = useNavigation();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(true)

  const toggleVisible = () => {
    setVisible(!visible)
  }

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
      setLoading(false)
      navigation.navigate('Redirect')
    } catch (err) {
      setLoading(false)
      console.log(err)
      Alert.alert(
        'Error',
        'Problem logging you in. Try checking your username and password'
      )
    }
  };

  return (
    <ImageBackground source={OrctalBg} style={{ flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 100 }}>
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <GradientText text='Welcome back' style={{ fontWeight: '700', fontSize: 25, }} />

        <View style={{ height: 75, width: 75, backgroundColor: colors.lighterBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center', marginTop: 40, zIndex: 1, elevation: 2, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 2,} }}>
          <View style={{ height: 65, width: 65, backgroundColor: colors.lightBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={OrctalLogo} style={{ width: 45, height: 45 }} />
          </View>
        </View>

        <View style={{ backgroundColor: colors.buttonTextColor, padding: 20, paddingTop: 80, width: '100%', borderRadius: 30, marginTop: -30 }}>
          <Text style={{ fontSize: 15, paddingLeft: 5, paddingBottom: 10 }}>Email</Text>
          <TextInput
            style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10 }}
            autoCapitalize="none"
            value={emailAddress}
            onChangeText={(email) => setEmailAddress(email)}
          />

          <Text style={{ fontSize: 15, paddingTop: 20, paddingLeft: 5, paddingBottom: 10 }}>Password</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, paddingHorizontal: 10 }}>
            <TextInput
              style={{ height: 40, width: '90%' }}
              autoCapitalize="none"
              value={password}
              secureTextEntry={visible}
              onChangeText={(password) => setPassword(password)}
            />
            <TouchableOpacity
              onPress={() => toggleVisible()}
            >
              {
                visible
                  ?
                  <Ionicons name="eye-off" size={22} color={colors.buttonColor} />
                  :
                  <Ionicons name="eye" size={22} color={colors.buttonColor} />

              }
            </TouchableOpacity>
          </View>

          <Text style={{ paddingTop: 20, paddingBottom: 20, textAlign: 'center', fontSize: 18 }}>Or</Text>

          <TouchableOpacity
            style={{ width: '95%', height: 50, backgroundColor: colors.buttonTextColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center', display: 'flex', borderColor: '#3744c3', borderWidth: 1 }}
          >
            <Text style={{ color: colors.deepBlue, fontSize: 16, textAlign: 'center' }}>Sign Up with Google</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{ backgroundColor: colors.lightBlue, width: '100%', height: 70, justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 50, borderRadius: 100, }}>
          <TouchableOpacity
            style={{ width: '95%', height: 60, backgroundColor: colors.buttonColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center', display: 'flex' }}
            onPress={() => { onSignInPress(); setLoading(true) }}
          >
            {
              loading
                ?
                <ActivityIndicator size='small' color='#ffffff' />
                :
                <Text style={{ color: colors.buttonTextColor, fontSize: 16, textAlign: 'center' }}>
                  Login
                </Text>
            }
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </ImageBackground>)
}