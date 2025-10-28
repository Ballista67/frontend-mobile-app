import { Input } from "@/components/Input";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useUser } from "@/contexts/UserContext";
import { addDoc, collection, getFirestore } from "@react-native-firebase/firestore";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { EXPO_PUBLIC_API_URL: API_URL } = process.env;

export default function AnsweredQuestions() {

    const {
        answeredQuestionsData: answeredQuestionsDataStr,
        gradedQuestionsData: gradedQuestionsDataStr,
        assessmentId
    } = useLocalSearchParams();

    const answeredQuestionsData = JSON.parse(answeredQuestionsDataStr as string);
    const gradedQuestionsData = JSON.parse(gradedQuestionsDataStr as string);

    const { user } = useUser();
    const db = getFirestore();

    const [students, setStudents] = useState<any[] | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const getStudentsByAssessment = async () => {

        if (!user) return;

        const formData = new FormData();
        formData.append("teacher_id", user.uid);
        formData.append("assessment_id", assessmentId as string);

        const res = await axios.post(`${API_URL}/get-students-by-assessment`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        setStudents(res.data.students);

    }

    const isQueriedStudent = (student: any) => {

        const { displayName } = student;

        const formattedDisplayName = displayName.trim().toLowerCase();
        const formattedSearchQuery = searchQuery.trim().toLowerCase();

        return formattedDisplayName.includes(formattedSearchQuery);

    }

    const createGradedAssessment = async (student: any) => {

        if (!user) return;

        Alert.alert(
            "Confirm",
            `Are you sure you want to grade this assessment for ${student.displayName}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {

                        await addDoc(collection(db, "teachers", user.uid, "gradedAssessments"), {
                            gradedQuestionsData: answeredQuestionsData.map(
                                (answeredQuestionData: any, index: number) => ({
                                    ...answeredQuestionData,
                                    ...gradedQuestionsData[index],
                                })
                            ),
                            studentId: student.uid,
                            assessmentId,
                        });

                        router.push("/grade-assessment/ClickImages");

                    },
                },
            ],
            { cancelable: true }
        );

    }

    useEffect(() => {
        getStudentsByAssessment();
    }, [])

    return (

        <View style={styles.container}>

            <ScreenHeader 
                title="Select Student" 
                backButtonHref="/(tabs)/Assessments"
            />

            <Input
                iconName="search-outline"
                placeholder="Search for a student..."
                style={{ borderRadius: 1000, marginTop: 12 }}
                value={searchQuery}
                setValue={setSearchQuery}
            />

            <ScrollView style={styles.studentsContainer}>

                {(students && students.length > 0) ? students.map((student, index) => isQueriedStudent(student) && (
                    <TouchableOpacity
                        style={styles.studentButton}
                        onPress={() => createGradedAssessment(student)}
                        key={index}
                    >
                        <Image
                            source={{ uri: student.photoURL }}
                            width={30}
                            height={30}
                            style={styles.studentButtonImage}
                        />
                        <Text style={styles.studentButtonText}>
                            {student.displayName}
                        </Text>
                    </TouchableOpacity>
                )) : (
                    <Text style={styles.noStudentsText}>
                        You don't currently have any students in this class!{" "}
                        Add them using the class's join code. 
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

    studentsContainer: {
        marginTop: 12,
        width: "100%"
    },

    studentButton: {
        borderRadius: 10,
        width: "100%",
        padding: 12,
        borderColor: "#595959",
        borderWidth: 0.5,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginBottom: 6,
    },
    studentButtonText: {
        color: "#fff",
        fontSize: 16
    },
    studentButtonImage: {
        borderRadius: 1000
    }, 

    noStudentsText: {
        color: "#b5b5b5",
        width: "100%",
        textAlign: "center",
        fontWeight: "300",
        marginTop: 12
    },

})