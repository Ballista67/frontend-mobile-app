import { Button } from "@/components/Button";
import { GradedQuestionContainer } from "@/components/graded-questions-screen/GradedQuestionContainer";
import { ScreenHeader } from "@/components/ScreenHeader";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

export default function GradedQuestions() {

    const { gradedQuestionsData } = useLocalSearchParams();
    const parsedGradedQuestionsData = JSON.parse(gradedQuestionsData as string);

    return (

        <View style={styles.container}>

            <ScreenHeader title="Graded Questions"/>

            <Button onPress={() => router.push("/(tabs)/Assessments")}>

            </Button>

            <ScrollView style={styles.gradedQuestionsContainer}>

                {parsedGradedQuestionsData.map((gradedQuestionData: any, index: number) => (
                    <GradedQuestionContainer 
                        gradedQuestionData={gradedQuestionData}
                        questionNum={index + 1}
                        key={index}
                    />
                ))}

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

    gradedQuestionsContainer: {
        marginTop: 36
    }

})