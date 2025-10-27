import { Button } from "@/components/Button";
import AssessmentContainer from "@/components/classes-screen/ClassContainer";
import { Input } from "@/components/Input";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useUser } from "@/contexts/UserContext";
import { arrayUnion, collection, collectionGroup, getDocs, getFirestore, query, updateDoc, where } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Classes() {

    const db = getFirestore();
    const { user, accountType } = useUser();

    const [classesData, setClassesData] = useState<any[] | null>(null);

    const [searchQuery, setSearchQuery] = useState<string>("");

    const [refreshingClasses, setRefreshingClasses] = useState<boolean>(false);

    const getClasses = async () => {

        if (!user || !accountType) {
            return;
        }

        if (accountType === "student") {

            setRefreshingClasses(true);

            const q = query(
                collectionGroup(db, "classes"),
                where("studentIds", "array-contains", user.uid)
            );

            const snap = await getDocs(q);
            setClassesData(snap.docs.map((doc: any) => ({ ...doc.data() })));
            setRefreshingClasses(false);

        }

        else {
            const snap = await getDocs(collection(db, "teachers", user.uid, "classes"));
            setClassesData(snap.docs.map((doc: any) => ({ ...doc.data() })));
        }

    }

    const joinClassWithCode = async (classCode: string) => {

        if (!user) {
            return;
        }

        const q = query(
            collectionGroup(db, "classes"),
            where("classCode", "==", classCode)
        );

        const snap = await getDocs(q);

        if (snap.empty) {
            Alert.alert("Error", "No class found with that join code! Please try again.");
            return;
        }

        const classDoc = snap.docs[0];
        const { name: className, studentIds } = classDoc.data();

        if (studentIds.includes(user.uid)) {
            Alert.alert("Error", "You have already joined this class!");
            return;
        }

        await updateDoc(classDoc.ref, {
            studentIds: arrayUnion(user?.uid),
        });

        await getClasses();

        Alert.alert("Join Successful", `Welcome to ${className}!`);

    }

    const promptJoinCode = async () => {

        let classCode;

        Alert.prompt(
            "Enter Join Code",
            "Please enter the class's join code.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Join",
                    onPress: async (classCode: string | undefined) => {
                        await joinClassWithCode(classCode || "")
                    }
                },
            ],
            "plain-text",
            "",
            "numeric"
        );

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

            <ScreenHeader title="Classes" />

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

            <ScrollView 
                refreshControl={<RefreshControl refreshing={refreshingClasses} onRefresh={getClasses}/>}
                style={styles.classesContainer}
            >

                {(classesData && classesData?.length > 0) ? (

                    classesData.map((classData, index) => isQueriedClass(classData) && (

                        <AssessmentContainer
                            classData={classData}
                            key={index}
                        />

                    ))

                ) : (

                    <Text style={styles.noClassesText}>
                        You don't currently have any classes!{" "}
                        {accountType === "student" ? 
                        "Use the + button to join one." : 
                        "Use our website to create one."}
                    </Text>

                )}

            </ScrollView>

            {accountType === "student" && (
                <Button
                    iconName="add-outline"
                    style={styles.joinClassButton}
                    iconSize={32}
                    onPress={promptJoinCode}
                />
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
    },

    joinClassButton: {
        position: "absolute",
        width: 50,
        height: 50,
        bottom: 30,
        right: 24
    }

})