import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface ScreenHeaderProps {
    title: string;
}

export function ScreenHeader({ title }: ScreenHeaderProps) {

    return (

        <View style={styles.container}>

            <TouchableOpacity style={styles.backButton}>

                <Ionicons 
                    name="arrow-back-outline"
                    color="#fff"
                    size={36}
                />

            </TouchableOpacity>

            <Text style={styles.titleText}>
                {title}
            </Text>

            <View/>

        </View>

    )

}

const styles = StyleSheet.create({

    container: {
        flexDirection: "row", 
        width: "100%"
    },

    titleText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
        marginHorizontal: "auto"
    }, 
    backButton: {
        position: "absolute", 
        left: 0
    }

})