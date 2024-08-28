import { View, Text, TextInput } from 'react-native'
import React from 'react'

import colors from '../../../utils/colors'

export default function TextAndTextInput({ text, style }) {
  return (
    <View>
      <Text style={[style, { fontSize: 15, paddingLeft: 5, paddingBottom: 10 }]}>{text}</Text>
      <TextInput style={{ height: 40, width: '100%', backgroundColor: colors.textInputbg, borderRadius: 100, padding: 10 }} />   
     </View >
  )
}