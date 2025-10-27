import { useUser } from "@/contexts/UserContext";
import { collectionGroup, getDocs, getFirestore, query, where } from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../Button";

interface AssessmentContainerProps {
    assessmentData: any
}

export default function AssessmentContainer({ assessmentData }: AssessmentContainerProps) {

    const router = useRouter();

    const db = getFirestore();

    const { user } = useUser();

    const [classData, setClassData] = useState<any>(null);

    const access = () => {
        router.push({
            pathname: "/grade-assessment/ClickImages",
            params: { assessmentId: assessmentData.id, scanError: 0 }
        })
    }

    const getAssessmentClassData = async () => {

        if (user) {

            const q = query(
                collectionGroup(db, "classes"),
                where("id", "==", assessmentData.classId)
            );

            const snap = await getDocs(q);

            if (!snap.empty) {
                setClassData(snap.docs[0].data());
            }

        }

    }

    useEffect(() => {
        getAssessmentClassData();
    }, [])

    if (!assessmentData || !classData) {
        return <View />
    }

    return (

        <View style={styles.container}>

            <View style={styles.iconContainer} />

            <View style={styles.assessmentNameContainer}>

                <Text 
                    style={styles.assessmentNameText}
                    numberOfLines={1}
                >
                    {assessmentData.name}
                </Text>

                <Text
                    style={styles.assessmentClassNameText}
                    numberOfLines={2}
                >
                    {classData.name}
                </Text>

            </View>

            <Button
                type="secondary"
                iconName="camera-outline"
                iconSize={20}
                style={styles.accessButton}
                onPress={access}
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

    assessmentNameContainer: {
        width: 170
    },

    assessmentNameText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2
    },
    assessmentClassNameText: {
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