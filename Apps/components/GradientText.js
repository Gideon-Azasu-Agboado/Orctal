import { View, Text } from 'react-native'
import React from 'react'
import {LinearGradient} from "expo-linear-gradient";
import MaskedView from '@react-native-community/masked-view';

export default function GradientText({ text, style }) {
  return (
    <MaskedView maskElement={<Text style={[style, {backgroundColor: 'transparent'}]}>{text}</Text>}>
    <LinearGradient
      colors={["#7d1ce1", "#c5992f"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1}}
    >
      <Text style={[style, {opacity:0}]}>
        {text}
      </Text>
    </LinearGradient>
    </MaskedView>
  )
}