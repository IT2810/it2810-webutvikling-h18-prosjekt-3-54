import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native';

const Row = (props) => (
    <View style={rowStyle.container}>
    
        {/*}{`${props.name.firstName} ${props.name.lastName}`}*/}
        
        <Text style={rowStyle.text}>
            {`${"Fornavn"} ${"Etternavn"}`}
            
        </Text>

    </View>
)

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
});

export default Row;