import { AnsweredQuestionContainer } from "@/components/answered-questions-screen/AnsweredQuestionContainer";
import { Button } from "@/components/Button";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useUser } from "@/contexts/UserContext";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

const { EXPO_PUBLIC_API_URL: API_URL } = process.env;

export default function AnsweredQuestions() {

    const { answeredQuestionsData: answeredQuestionsDataStr, assessmentId } = useLocalSearchParams();

    const { user } = useUser();

    const [answeredQuestionsData, setAnsweredQuestionsData] = useState<any[]>(JSON.parse(answeredQuestionsDataStr as string));
    const [gradedQuestionsData, setGradedQuestionsData] = useState<any[] | null>(null);

    const [gradingQuestions, setGradingQuestions] = useState<boolean>(false);

    const gradeAssessmentAnsweredQuestions = async () => {

        setGradingQuestions(true);

        const formData = new FormData();
        formData.append("teacher_id", user?.uid || "");
        formData.append("assessment_id", assessmentId as string);
        formData.append("answered_questions_data", JSON.stringify(answeredQuestionsData));

        const res = await axios.post(`${API_URL}/grade-assessment-answered-questions`, formData);

        setGradedQuestionsData(res.data.gradedQuestionsData);
        setGradingQuestions(false);

    }

    return (

        <View style={styles.container}>

            {gradingQuestions && <ActivityIndicator size="large" color="#fff" />}

            <ScreenHeader 
                title="Answered" 
                backButtonHref="/(tabs)/Assessments"
            />

            <ScrollView style={styles.answeredQuestionsContainer}>

                {answeredQuestionsData.map((answeredQuestionData: any, index: number) => (
                    <AnsweredQuestionContainer
                        answeredQuestionData={answeredQuestionData}
                        gradedQuestionData={gradedQuestionsData ? gradedQuestionsData[index] : null}
                        updateFreeResponse={value => {
                            setAnsweredQuestionsData(prev => {
                                const newData = [...prev];
                                newData[index] = { ...newData[index], freeResponse: value };
                                return newData;
                            })
                        }}
                        updateEarnedPoints={value => {
                            setGradedQuestionsData(prev => {
                                const newData = prev ? [...prev] : [];
                                newData[index] = { ...newData[index], earnedPoints: value };
                                return newData;
                            })
                        }}
                        questionNum={index + 1}
                        key={index}
                    />
                ))}

            </ScrollView>

            {gradedQuestionsData === null ? (
                <Button
                    onPress={gradeAssessmentAnsweredQuestions}
                    iconName="sparkles-outline"
                    iconSize={24}
                    style={{ height: 50 }}
                    disabled={gradingQuestions}
                >
                    Grade Answers
                </Button>
                
            ) : (
                <Button
                    iconName="person-outline"
                    onPress={() => {
                        router.push({
                            pathname: "/grade-assessment/SelectStudent", 
                            params: {
                                answeredQuestionsData: JSON.stringify(answeredQuestionsData),
                                gradedQuestionsData: JSON.stringify(gradedQuestionsData), 
                                assessmentId
                            }
                        })
                    }}
                    style={{ height: 50 }}
                    iconSize={20}
                >
                    Select Student
                </Button>
            )}


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

    answeredQuestionsContainer: {
        marginTop: 36
    }

})