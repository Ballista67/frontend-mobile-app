import { StyleSheet, Text, View } from "react-native";
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import ClassContainer from "@/components/classesScreen/ClassContainer";
import { ScreenHeader } from "@/components/ScreenHeader";

export default function Classes() {

    const db = getFirestore();
    const { user } = useUser();

    const [classesData, setClassesData] = useState<any[] | null>(null);

    const getClasses = async () => {

        if (user) {

            const snap = await getDocs(collection(db, "users", user.uid, "classes"));

            setClassesData(snap.docs.map((doc: any) => ({ ...doc.data() })))

        }

    }

    useEffect(() => {
        getClasses();
    }, []);

    return (

        <View style={styles.container}>

            <ScreenHeader
                title="Classes"
                description="Access all your classes in one place."
            />

            <View style={styles.classesContainer}>

                {
                    (classesData) ? (

                        classesData.map((classData, index) => (

                            <ClassContainer
                                classData={classData}
                                key={index}
                            />

                        ))

                    ) : (

                        <Text style={styles.noClassesText}>
                            You don't currently have any classes! Use our website to create one.
                        </Text>

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

    classesContainer: {
        flexDirection: "column",
        gap: 12, 
        width: "100%"
    },

    noClassesText: {
        color: "#b5b5b5", 
        width: "100%", 
        textAlign: "center", 
        fontWeight: "200"
    }

})