import { Button } from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useUser } from '@/contexts/UserContext';
import axios from "axios";
import { router, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ImagesSummary() {

    const { EXPO_PUBLIC_API_URL: API_URL } = process.env;

    const { imageURIs, assessmentId } = useLocalSearchParams();

    const { user } = useUser();

    const parsedImageURIs = JSON.parse(imageURIs as string);

    const grade = async () => {

        const formData = new FormData();

        if (user) formData.append("teacher_id", user?.uid);
        formData.append("assessment_id", assessmentId as string);

        parsedImageURIs.forEach((uri: string, index: number) => {
            formData.append("files", {
                uri,
                name: `image_${index}.png`,
                type: "image/png"
            } as any);
        });

        try {

            const res = await axios.post(`${API_URL}/grade-assessment`, formData);

            const { status } = res.data["status"];
            const gradedQuestionsData = res.data["graded_questions_data"];

            router.push({
                pathname: "/grade-assessment/GradedQuestions", 
                params: { gradedQuestionsData: JSON.stringify(gradedQuestionsData) }
            })

        }

        catch (err) {
            router.push({
                pathname: "/grade-assessment/ClickImages", 
                params: { assessmentId, scanError: 1 }
            })
        }

    }

    return (

        <View style={styles.container}>

            <ScreenHeader title='Images' />

            <Text style={styles.imagesOrderText}>
                Please make sure the images are in the correct order.
            </Text>

            <ScrollView style={styles.imagesContainer}>

                {parsedImageURIs.map((imageURI: any, index: number) => (
                    <Image
                        source={{ uri: imageURI }}
                        height={240}
                        width={180}
                        style={styles.image}
                        key={index}
                    />
                ))}

            </ScrollView>

            <View style={styles.optionsContainer}>

                <Button
                    iconName='close-outline'
                    style={[styles.optionsButton, { backgroundColor: "#EB3B3B" }]}
                    textStyle={styles.optionsButtonText}
                    iconSize={28}
                    onPress={() => router.push("/(tabs)/Assessments")}
                >
                    Cancel
                </Button>

                <Button
                    iconName='sparkles-outline'
                    style={[styles.optionsButton]}
                    textStyle={styles.optionsButtonText}
                    iconSize={28}
                    onPress={grade}
                >
                    Auto Grade
                </Button>

            </View>

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

    imagesOrderText: {
        color: "#b5b5b5",
        textAlign: "center",
        marginTop: 12
    },

    imagesContainer: {
        display: "flex",
        flexDirection: "column",
        marginTop: 32,
        paddingRight: 10
    },
    image: {
        marginBottom: 12,
        borderRadius: 10
    },

    optionsContainer: {
        flexDirection: "row",
        gap: 12,
        position: "absolute",
        bottom: 36
    },
    optionsButton: {
        height: 50,
        width: 160,
    },
    optionsButtonText: {
        fontSize: 14
    }

})