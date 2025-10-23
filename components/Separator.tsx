import { StyleSheet, Text, View } from "react-native";

interface SeparatorProps {
    label: string;
    style?: object;
}

export function Separator({ label, style } : SeparatorProps) {

    return (

        <View style={[styles.container, style]}>

            <View style={styles.lineContainer}/>

            <Text style={styles.labelText}>
                {label}
            </Text>

            <View style={styles.lineContainer}/>

        </View>

    )

}

const styles = StyleSheet.create({

    container: {
        width: "44%", 
        flexDirection: "row", 
        alignItems: "center",
        justifyContent: "center",
        gap: 10
    },

    lineContainer: {
        backgroundColor: "#b5b5b5", 
        height: 1, 
        width: "100%", 
        opacity: 0.5
    }, 

    labelText: {
        color: "#b5b5b5", 
        fontSize: 14, 
        textTransform: "uppercase", 
        width: 25, 
        fontWeight: "bold"
    }

})