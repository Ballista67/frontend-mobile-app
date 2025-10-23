import { StyleSheet, Text, View } from "react-native";

interface ClassContainerProps {
    classData: any
}

export default function ClassContainer({ classData } : ClassContainerProps) {

    return (

        <View style={styles.container}>

            <Text style={styles.classNameText}>
                {classData.name}
            </Text>

            <Text style={styles.classStudentCountText}>
                Student Count: 27
            </Text>

        </View>

    )

}

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#181818", 
        borderRadius: 10, 
        width: "100%", 
        padding: 12, 
		borderColor: "#595959",
		borderWidth: 0.5,
    },

    classNameText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: '600', 
        marginBottom: 6
    }, 
    classStudentCountText: {
        color: "#b5b5b5"
    }

})