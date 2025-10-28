import { Button } from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useUser } from '@/contexts/UserContext';
import axios from "axios";
import { router, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const { EXPO_PUBLIC_API_URL: API_URL } = process.env;

export default function ImagesSummary() {

    const { imageURIs, assessmentId } = useLocalSearchParams();

    const { user } = useUser();

    const parsedImageURIs = JSON.parse(imageURIs as string);

    const readAssessmentAnsweredQuestions = async () => {

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

            const res = await axios.post(`${API_URL}/read-assessment-answered-questions`, formData);

            const answeredQuestionsData = res.data["answeredQuestionsData"];

            router.push({
                pathname: "/grade-assessment/AnsweredQuestions",
                params: {
                    answeredQuestionsData: JSON.stringify(answeredQuestionsData),
                    assessmentId
                }
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

            <ScreenHeader 
                title='Images'
                backButtonHref="/(tabs)/Assessments"
            />

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

            <Button
                iconName='sparkles-outline'
                style={{height: 50}}
                iconSize={24}
                onPress={readAssessmentAnsweredQuestions}
            >
                Read Answers
            </Button>

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

})