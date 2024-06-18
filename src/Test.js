import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function Test(props) {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>

            <TouchableOpacity
                onPress={() => props?.navigation?.navigate('Root')}
                style={{
                    backgroundColor: 'red',
                    padding: 10
                }} >
                <Text style={{ color: 'white' }}>Click here</Text>

            </TouchableOpacity>
        </View>
    )
}