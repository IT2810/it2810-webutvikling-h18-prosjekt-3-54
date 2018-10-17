import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native';

const rowStyle = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        marginLeft: 12,
        fontSize: 16,
    },
    photo: {    
        height: 40,
        width: 40,
        borderRadius: 20,
    },
});

const Row = (props) => (
    <View style={rowStyle.container}>
        <Image
            source={
            __DEV__
                ? require('../assets/images/robot-prod.png')
                : require('../assets/images/robot-dev.png')
            }
        />

        {/*}
        <Text style={rowStyle.text}>
            {`${"Fornavn"} ${"Etternavn"}`}
        </Text>
        */}
        
        
        <Text style={rowStyle.text}>
            {/*}{`${props.name.firstName} ${props.name.lastName}`}*/}
            fornavn etternavn
        </Text>
    
        
    </View>
)

export default Row;