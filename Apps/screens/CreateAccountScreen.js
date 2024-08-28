import { View, Text, ImageBackground, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useCallback } from 'react'
import { useSignUp } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";
import { useNavigation } from '@react-navigation/native';

WebBrowser.maybeCompleteAuthSession();

import colors from '../../utils/colors';
const OrctalBg = require("../../assets/images/Orctal new bg.png")
const OrctalLogo = require("../../assets/images/Orctal logo.png")
import GradientText from '../components/GradientText'

export default function CreateAccountScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();
    useWarmUpBrowser();
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
    const navigation = useNavigation();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false)
    const [codeLoading, setCodeLoading] = useState(false) 


    const createAccount = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            await signUp.create({
                emailAddress,
                password,
            });

            // send the email.
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            
            // change the UI to our pending section.
            setLoading(false)
            setPendingVerification(true);
        } catch (err) {
            Alert.alert(
                'Error',
                err.errors[0].message,
                [{
                    text: 'OK'
                }]
            )
            setLoading(false)
        }
    };

    // This verifies the user using email code that is delivered.
    const VerifyCode = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            await setActive({ session: completeSignUp.createdSessionId });
            setCodeLoading(false)
            navigation.navigate('AccountType')
        } catch (err) {
            Alert.alert(
                'Error',
                err.errors[0].message,
                [{
                    text: 'OK'
                }]
            )
            setCodeLoading(false)
        }
    };


    const GoogleSignUp = useCallback(async () => {
        try {
          const { createdSessionId, signIn, signUp, setActive } =
            await startOAuthFlow();
     
          if (createdSessionId) {
            setActive({ session: createdSessionId });
            navigation.navigate('AccountType')
          } else {
            // Use signIn or signUp for next steps such as MFA
          }
        } catch (err) {
          console.error("OAuth error", err);
        }
      }, []);

    return (
        <ImageBackground source={OrctalBg} style={{ flex: 1, paddingRight: 10, paddingLeft: 10, paddingTop: 100 }}>
            {!pendingVerification && (
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <GradientText text='Create Your Account' style={{ fontWeight: '700', fontSize: 25, }} />

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
                        <TextInput
                            style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10 }}
                            autoCapitalize="none"
                            value={password}
                            secureTextEntry={true}
                            onChangeText={(password) => setPassword(password)}
                        />

                        <Text style={{ paddingTop: 20, paddingBottom: 20, textAlign: 'center', fontSize: 18 }}>Or</Text>

                        <TouchableOpacity
                            style={{ width: '95%', height: 50, backgroundColor: colors.buttonTextColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center', display: 'flex', borderColor: '#3744c3', borderWidth: 1 }}
                        onPress={GoogleSignUp}
                        >
                            <Text style={{ color: colors.deepBlue, fontSize: 16, textAlign: 'center' }}>Sign in with Google</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={{ backgroundColor: colors.lightBlue, width: '100%', height: 70, justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 50, borderRadius: 100, }}>
                        <TouchableOpacity
                            style={{ width: '95%', height: 60, backgroundColor: colors.buttonColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center', display: 'flex' }}
                            onPress={() => { setLoading(true); createAccount(); }}
                        >
                            {
                                loading
                                    ?
                                    <ActivityIndicator size='small' color='#ffffff' />
                                    :
                                    <Text style={{ color: colors.buttonTextColor, fontSize: 16, textAlign: 'center' }}>
                                        Create
                                    </Text>
                            }
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            )}
            {pendingVerification && (
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <GradientText text='Verify Code' style={{ fontWeight: '700', fontSize: 25, }} />

                    <View style={{ height: 75, width: 75, backgroundColor: colors.lighterBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center', marginTop: 40, zIndex: 1, elevation: 2, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 2,} }}>
                        <View style={{ height: 65, width: 65, backgroundColor: colors.lightBlue, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={OrctalLogo} style={{ width: 45, height: 45 }} />
                        </View>
                    </View>

                    <View style={{ backgroundColor: colors.buttonTextColor, padding: 20, paddingTop: 80, width: '100%', borderRadius: 30, marginTop: -30 }}>
                    <Text style={{ fontSize: 19, paddingTop: 20, paddingLeft: 5, paddingBottom: 10, textAlign: 'center', marginBottom: 20, fontWeight: 500 }}>Check your email for code</Text>

                        <View>
                            <TextInput
                                style={{ height: 50, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, paddingLeft: 20 }}
                                value={code}
                                placeholder="Code..."
                                onChangeText={(code) => setCode(code)}
                            />
                        </View>
                        <TouchableOpacity
                            style={{ backgroundColor: colors.lightBlue, width: '100%', height: 70, justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: 20, borderRadius: 100, }}>
                            <TouchableOpacity
                                style={{ width: '95%', height: 60, backgroundColor: colors.buttonColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center', display: 'flex' }}
                                onPress={() => { setCodeLoading(true); VerifyCode();}}>
                                {
                                    codeLoading
                                        ?
                                        <ActivityIndicator size='small' color='#ffffff' />
                                        :
                                        <Text style={{ color: colors.buttonTextColor, fontSize: 16, textAlign: 'center' }}>
                                            Verify Code
                                        </Text>
                                }
                            </TouchableOpacity>
                        </TouchableOpacity>

                    </View>
                </View>
            )}
        </ImageBackground >
    )
}