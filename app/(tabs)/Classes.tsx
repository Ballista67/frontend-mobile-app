import AssessmentContainer from "@/components/classes-screen/ClassContainer";
import { Input } from "@/components/Input";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useUser } from "@/contexts/UserContext";
import { collection, getDocs, getFirestore } from '@react-native-firebase/firestore';
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Classes() {

    const db = getFirestore();
    const { user } = useUser();

    // [
    //     {
    //         name: "AP Physics 1", 
    //         description: "Learn about kinematics, forces, energy, and calculus!"
    //     }, 
    //     {
    //         name: "AP Computer Science Principles", 
    //         description: "Learn about kinematics, forces, energy, and calculus!"
    //     }, 
    //     {
    //         name: "AP English Language and Composition", 
    //         description: "Learn about kinematics, forces, energy, and calculus!"
    //     }, 
    //     {
    //         name: "AP Physics 1", 
    //         description: "Learn about kinematics, forces, energy, and calculus!"
    //     }, 
    //     {
    //         name: "AP Computer Science Principles", 
    //         description: "Learn about kinematics, forces, energy, and calculus!"
    //     }, 
    //     {
    //         name: "AP English Language and Composition", 
    //         description: "Learn about kinematics, forces, energy, and calculus!"
    //     }, 
    // ]

    const [classesData, setClassesData] = useState<any[] | null>(null);

    const [searchQuery, setSearchQuery] = useState<string>("");

    const getClasses = async () => {

        if (user) {

            const snap = await getDocs(collection(db, "teachers", user.uid, "classes"));

            setClassesData(snap.docs.map((doc: any) => ({ ...doc.data() })))

        }

    }

    const isQueriedClass = (classData: any) => {

        const { name: className } = classData;

        const formattedClassName = className.trim().toLowerCase();
        const formattedSearchQuery = searchQuery.trim().toLowerCase();

        return formattedClassName.includes(formattedSearchQuery);

    }

    useEffect(() => {
        getClasses();
    }, []);

    return (

        <View style={styles.container}>

            <ScreenHeader title="Classes"/>

            <Image
                source={require("@/assets/undraw-teaching.png")}
                style={styles.image}
            />

            <Input 
                iconName="search-outline"
                placeholder="Search for a class..."
                style={{ borderRadius: 1000 }}
                value={searchQuery}
                setValue={setSearchQuery}
            />

            <ScrollView style={styles.classesContainer}>

                {(classesData && classesData?.length > 0) ? (

                    classesData.map((classData, index) => isQueriedClass(classData) && (

                        <AssessmentContainer
                            classData={classData}
                            key={index}
                        />

                    ))

                ) : (

                    <Text style={styles.noClassesText}>
                        You don't currently have any classes! Use our website to create one.
                    </Text>

                )}

            </ScrollView>


        </View>

    )

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
        padding: 32,
        paddingTop: 72
    },

    classesContainer: {
        flexDirection: "column",
        width: "100%", 
        marginTop: 12, 
    },

    noClassesText: {
        color: "#b5b5b5", 
        width: "100%", 
        textAlign: "center", 
        fontWeight: "300", 
        marginTop: 12
    }, 

    image: {
        width: 220, 
        height: 220, 
        marginTop: 36, 
        marginBottom: 12
    }

})