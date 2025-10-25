import { StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import { Button } from "../Button";

interface AssessmentContainerProps {
    assessmentData: any
}

export default function AssessmentContainer({ assessmentData }: AssessmentContainerProps) {

    return (

        <View style={styles.container}>

            <View style={styles.iconContainer} />

            <View style={styles.classNameContainer}>

                <Text style={styles.classNameText}>
                    {assessmentData.name}
                </Text>

                <Text style={styles.classStudentCountText}>
                    AP Physics C: Mechanics
                </Text>

            </View>

            <Button
                type="secondary"
                iconName="arrow-forward-outline"
                iconSize={20}
                style={styles.accessButton}
            />

        </View>

    )

}

const styles = StyleSheet.create({

    container: {
        borderRadius: 20,
        width: "100%",
        padding: 12,
        borderColor: "#595959",
        borderWidth: 0.5,
        flexDirection: "row",
        gap: 12, 
        alignItems: "center", 
        marginBottom: 12
    },

    classNameContainer: {
        width: 170
    },

    classNameText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2
    },
    classStudentCountText: {
        color: "#b5b5b5"
    },

    iconContainer: {
        backgroundColor: "#5763d8",
        width: 60,
        height: 60,
        marginVertical: "auto",
        borderRadius: 10
    },

    accessButton: {
        width: 50, 
        height: 50
    }

})