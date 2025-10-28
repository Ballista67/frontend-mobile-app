import { Button } from '@/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { CameraCapturedPicture, CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ClickImages() {

    const router = useRouter();

    const { assessmentId, scanError } = useLocalSearchParams();

    const [cameraPermission, requestCameraPermission] = useCameraPermissions();

    const cameraContainerRef = useRef(null);
    const [cameraImageURI, setCameraImageURI] = useState<string | null>(null);

    const [allImageURIs, setAllImageURIs] = useState<any[]>([]);

    const [clickingImage, setClickingImage] = useState<boolean>(false);

    const clickImage = async () => {
        setClickingImage(true);
        if (cameraContainerRef.current) {
            const image = await cameraContainerRef.current.takePictureAsync();
            setCameraImageURI(image.uri);
        }
    }

    const retakeImage = () => {
        setClickingImage(false);
        setCameraImageURI(null);
    }

    const useImage = () => {
        setAllImageURIs(prev => [
            ...prev,
            cameraImageURI
        ]);
        retakeImage();
    }

    const finish = () => {
        router.push({
            pathname: "/grade-assessment/ImagesSummary", 
            params: { 
                imageURIs: JSON.stringify(allImageURIs),
                assessmentId
            }
        })
    }

    useEffect(() => {
        if (parseInt(scanError as string)) {
            Alert.alert("Error", "Please scan the assessment papers again!");
        }
    }, [])

    if (!cameraPermission) {
        return <View />;
    }

    if (!cameraPermission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.cameraPermissionText}>We need your permission to show the camera</Text>
                <Button onPress={requestCameraPermission}>
                    Grant Permission
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => router.push("/(tabs)/Assessments")}
            >
                <Ionicons
                    name='close-outline'
                    size={40}
                    color="#fff"
                />
            </TouchableOpacity>

            {cameraImageURI ? (

                <>

                    <Image
                        source={{ uri: cameraImageURI }}
                        style={styles.cameraContainer}
                    />

                    <View style={styles.imageOptionsContainer}>

                        <Button
                            style={styles.imageOptionsButton}
                            textStyle={styles.imageOptionsButtonText}
                            onPress={useImage}
                        >
                            Use Image
                        </Button>

                        <Button
                            type="secondary"
                            style={styles.imageOptionsButton}
                            textStyle={styles.imageOptionsButtonText}
                            onPress={retakeImage}
                        >
                            Retake
                        </Button>

                    </View>

                </>

            ) : (
                <>

                    <TouchableOpacity
                        style={[styles.finishButton, { opacity: allImageURIs.length <= 0 ? 0.5 : 1 }]}
                        onPress={finish}
                        disabled={allImageURIs.length <= 0}
                    >
                        <Text style={styles.finishButtonText}>
                            Finish
                        </Text>
                    </TouchableOpacity>

                    <CameraView
                        style={styles.cameraContainer}
                        facing="back"
                        ref={cameraContainerRef}
                    />

                    <Button
                        iconName='camera-outline'
                        style={styles.clickImageButton}
                        iconSize={36}
                        onPress={clickImage}
                        disabled={clickingImage}
                    />

                </>

            )}

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
    },

    cameraPermissionText: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    cameraContainer: {
        flex: 1,
    },

    clickImageButton: {
        width: 90,
        height: 90,
        borderRadius: 1000,
        position: "absolute",
        bottom: 70,
        alignSelf: "center",
        borderWidth: 8,
        borderColor: "#8890dcff",
    },

    closeButton: {
        position: "absolute",
        top: 64,
        left: 10,
        zIndex: 1
    },

    finishButton: {
        position: "absolute",
        top: 68,
        right: 16,
        zIndex: 1
    },
    finishButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18
    },

    imageOptionsContainer: {
        position: "absolute",
        bottom: 70,
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        gap: 12
    },
    imageOptionsButton: {
        height: 60,
        width: 160,
        borderRadius: 1000
    },
    imageOptionsButtonText: {
        fontSize: 18,
        fontWeight: "bold"
    }

});
