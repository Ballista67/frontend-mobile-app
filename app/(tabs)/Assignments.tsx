import { StyleSheet, Text, View } from "react-native";
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import ClassContainer from "@/components/classesScreen/ClassContainer";
import { ScreenHeader } from "@/components/ScreenHeader";

export default function Classes() {

    const db = getFirestore();
    const { user } = useUser();

    const [assignmentsData, setAssignmentsData] = useState<any[] | null>(null);

    const getAssignments = async () => {

        if (user) {

            const snap = await getDocs(collection(db, "users", user.uid, "assessments"));

            setAssignmentsData(snap.docs.map((doc: any) => ({ ...doc.data() })));

        }

    }

    useEffect(() => {
        getAssignments();
    }, []);

    return (

        <View style={styles.container}>

            <ScreenHeader
                title="Assignments"
                description="Access all your assignments in one place."
            />

            <View style={styles.classesContainer}>

                {
                    assignmentsData ? (

                        assignmentsData.map((classData, index) => (

                            <ClassContainer
                                classData={classData}
                                key={index}
                            />

                        ))

                    ) : (

                        <Text>No classes! Use our website to create one!</Text>

                    )

                }

            </View>


        </View>

    )

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
        padding: 36,
        paddingTop: 200
    },

    classesText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 6
    },
    classesDescriptionText: {
        color: "#b5b5b5",
        fontSize: 15,
        marginBottom: 30,
        textAlign: "center"
    },
    classesContainer: {
        flexDirection: "column",
        gap: 12,
        width: "100%"
    }

})