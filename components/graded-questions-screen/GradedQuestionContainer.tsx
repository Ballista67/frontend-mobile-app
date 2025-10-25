import { StyleSheet, Text, View } from "react-native";

interface GradedQuestionContainerProps {
    gradedQuestionData: any;
    questionNum: number;
}

export function GradedQuestionContainer({ gradedQuestionData, questionNum }: GradedQuestionContainerProps) {

    const answerChoiceLabels = ["A", "B", "C", "D", "E"];

    return (

        <View style={styles.container}>

            <Text style={styles.promptText}>
                {questionNum}. {gradedQuestionData.prompt}
            </Text>

            <View style={styles.answerChoicesContainer}>

                {gradedQuestionData.answer_choices.map((answerChoice: any, index: number) => (

                    <View
                        key={index}
                        style={styles.answerChoiceContainer}

                    >

                        <Text style={[
                            styles.answerChoiceLabelText,
                            gradedQuestionData.selected_answer_choices_indices.includes(index) && 
                            styles.selectedAnswerChoiceLabelText
                        ]}>
                            {answerChoiceLabels[index]}
                        </Text>

                        <Text
                            style={styles.answerChoiceText}
                        >
                            {answerChoice}
                        </Text>

                    </View>

                ))}

            </View>

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
        gap: 6
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

})