import { StyleSheet, Text, View } from "react-native"

interface ScreenHeaderProps {
    title: string;
    description: string;
}

export function ScreenHeader({ title, description }: ScreenHeaderProps) {

    return (

        <View style={styles.container}>

            <Text style={styles.titleText}>
                {title}
            </Text>

            <Text style={styles.descriptionText}>
                Access all your classes in one place.
            </Text>

        </View>

    )

}

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#5763d8", 
        position: "absolute", 
        width: "130%", 
        paddingTop: 80, 
        borderBottomLeftRadius: 50, 
        borderBottomRightRadius: 50, 
    },

    titleText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 6, 
        textAlign: "center"
    },
    descriptionText: {
        color: "#cececeff",
        fontSize: 15,
        marginBottom: 30,
        textAlign: "center", 
        fontWeight: "semibold"
    }

})