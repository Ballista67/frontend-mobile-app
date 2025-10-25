import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import AssessmentContainer from "@/components/assessmentsScreen/AssessmentContainer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Input } from "@/components/Input";

export default function Assessments() {

    const db = getFirestore();
    const { user } = useUser();

    // {
    //         name: "Torque and Rotational Motion Test", 
    //     }, 
    //     {
    //         name: "Incline Planes and Friction Test", 
    //     }, 
    //     {
    //         name: "Graphing Motion Quiz", 
    //     }, 

    const [assessmentsData, setAssessmentsData] = useState<any[] | null>(null);

    const [searchQuery, setSearchQuery] = useState<string>("");

    const getAssessments = async () => {

        if (user) {

            const snap = await getDocs(collection(db, "teachers", user.uid, "assessments"));

            setAssessmentsData(snap.docs.map((doc: any) => ({ ...doc.data() })))

        }

    }

    const isQueriedAssessment = (assessmentData: any) => {

        const { name: assessmentName } = assessmentData;

        const formattedAssessmentName = assessmentName.trim().toLowerCase();
        const formattedSearchQuery = searchQuery.trim().toLowerCase();

        return formattedAssessmentName.includes(formattedSearchQuery);

    }

    useEffect(() => {
        getAssessments();
    }, []);

    return (

        <View style={styles.container}>

            <ScreenHeader title="Assessments"/>

            <Image
                source={require("@/assets/undraw-choose.png")}
                style={styles.image}
            />

            <Input 
                iconName="search-outline"
                placeholder="Search for an assessment..."
                style={{ borderRadius: 1000 }}
                value={searchQuery}
                setValue={setSearchQuery}
            />

            <ScrollView style={styles.assessmentsContainer}>

                {(assessmentsData && assessmentsData?.length > 0) ? (

                    assessmentsData.map((assessmentData, index) => isQueriedAssessment(assessmentData) && (

                        <AssessmentContainer
                            assessmentData={assessmentData}
                            key={index}
                        />

                    ))

                ) : (

                    <Text style={styles.noAssessmentsText}>
                        You don't currently have any assessments! Use our website to create one.
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
        padding: 36,
        paddingTop: 72
    },

    assessmentsContainer: {
        flexDirection: "column",
        width: "100%", 
        marginTop: 12
    },

    noAssessmentsText: {
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