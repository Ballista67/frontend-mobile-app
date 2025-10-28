import { Ionicons } from "@expo/vector-icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from "../Button";

interface AnsweredQuestionContainerProps {
    answeredQuestionData: any;
    gradedQuestionData: any | null;
    updateFreeResponse: Dispatch<SetStateAction<any>>;
    updateEarnedPoints: Dispatch<SetStateAction<any>>;
    questionNum: number;
}

export function AnsweredQuestionContainer({ answeredQuestionData, gradedQuestionData, updateFreeResponse, updateEarnedPoints, questionNum }: AnsweredQuestionContainerProps) {

    const answerChoiceLabels = ["A", "B", "C", "D", "E"];

    const [initialEarnedPoints, setInitialEarnedPoints] = useState<number | null>(null);

    useEffect(() => {
        if (gradedQuestionData && initialEarnedPoints === null) {
            setInitialEarnedPoints(gradedQuestionData.earnedPoints)
        }
    }, [gradedQuestionData])

    const alertFreeResponseQuestionFeedback = () => {

        if (!gradedQuestionData) return;

        Alert.alert("Auto Grade", 
            `(${initialEarnedPoints}/${answeredQuestionData.points}) ${gradedQuestionData.freeResponseFeedback}\n\nGraded by Gemini 2.0 Flash`
        )

    }

    return (
        <View style={styles.container}>

            <Text style={styles.promptText}>
                {questionNum}. {answeredQuestionData.prompt}
            </Text>

            {answeredQuestionData.type === "freeResponse" ? (
                <View>
                    <TextInput
                        style={styles.freeResponseAnswerTextInput}
                        value={answeredQuestionData.freeResponse}
                        multiline
                        onChangeText={updateFreeResponse}
                    />
                    <View style={styles.freeResponsePointsContainer}>
                        {[...Array(answeredQuestionData.points + 1)].map((_, index) => (
                            <Button
                                key={index}
                                style={styles.freeResponsePointButton}
                                type={(gradedQuestionData && gradedQuestionData.earnedPoints === index) ? "primary" : "secondary"}
                                textStyle={{ fontSize: 10 }}
                                disabled={!gradedQuestionData}
                                onPress={() => updateEarnedPoints(index)}
                            >
                                {index.toString()}
                            </Button>
                        ))}
                        {gradedQuestionData && (
                            <TouchableOpacity
                                onPress={alertFreeResponseQuestionFeedback}
                                disabled={initialEarnedPoints !== gradedQuestionData.earnedPoints}
                                style={{ opacity: initialEarnedPoints === gradedQuestionData.earnedPoints ? 1 : 0.5}}
                            >
                                <Ionicons 
                                    name="information-circle-outline"
                                    color="#b5b5b5"
                                    size={24}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ) : (
                <View style={styles.answerChoicesContainer}>
                    {answeredQuestionData.answerChoices.map((answerChoice: any, index: number) => (
                        <View
                            key={index}
                            style={styles.answerChoiceContainer}
                        >
                            <Text
                                style={[
                                    styles.answerChoiceLabelText,
                                    answeredQuestionData.selectedAnswerChoicesIndices.includes(index) &&
                                    styles.selectedAnswerChoiceLabelText
                                ]}
                            >
                                {answerChoiceLabels[index]}
                            </Text>

                            <Text style={styles.answerChoiceText}>
                                {answerChoice}
                            </Text>

                            {gradedQuestionData && <>
                                {gradedQuestionData.correctAnswerChoicesIndices.includes(index) &&
                                    <Ionicons
                                        name="checkmark-outline"
                                        color="green"
                                        size={24}
                                        style={{ position: "relative", bottom: 5, right: 2 }}
                                    />}

                                {!gradedQuestionData.correctAnswerChoicesIndices.includes(index) &&
                                    answeredQuestionData.selectedAnswerChoicesIndices.includes(index) &&
                                    <Ionicons
                                        name="close-outline"
                                        color="red"
                                        size={24}
                                        style={{ position: "relative", bottom: 3, right: 3 }}
                                    />}

                            </>}

                        </View>
                    ))}
                </View>
            )}

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        marginBottom: 24
    },

    promptText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold"
    },

    answerChoicesContainer: {
        flexDirection: "column",
        gap: 6,
        marginTop: 6,
        marginLeft: 24
    },

    answerChoiceContainer: {
        flexDirection: "row",
        gap: 6,
        height: 20
    },
    answerChoiceLabelText: {
        borderWidth: 0.5,
        borderColor: "#fff",
        borderRadius: 1000,
        width: 20,
        height: 20,
        color: "#fff",
        textAlign: "center",
        lineHeight: 18,
        fontSize: 10
    },
    selectedAnswerChoiceLabelText: {
        color: "#000",
        backgroundColor: "#fff"
    },
    answerChoiceText: {
        color: "#fff",
        fontSize: 16
    },

    freeResponseAnswerTextInput: {
        borderColor: "#fff",
        borderWidth: 0.5,
        borderRadius: 10,
        marginTop: 6,
        color: "#fff",
        padding: 8,
        minHeight: 80
    },
    freeResponsePointsContainer: {
        flexDirection: "row",
        gap: 3,
        marginTop: 3,
        width: "100%",
        justifyContent: "flex-end"
    },
    freeResponsePointButton: {
        width: 35,
        height: 24,
        borderRadius: 5
    }

})