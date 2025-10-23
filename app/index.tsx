import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Separator } from "@/components/Separator";
import { getApp } from "@react-native-firebase/app";
import auth, { GoogleAuthProvider, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { useState, useEffect } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

export default function LogIn() {
	
	const router = useRouter();

	const firebaseApp = getApp();

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const [logInLoading, setLogInLoading] = useState<boolean>(false);

    useEffect(() => {
		GoogleSignin.configure({
			webClientId: "824192608993-vi9bicl7vu7flrpmgcp1q6r6m0pv366f.apps.googleusercontent.com"
		});
	}, []);

	const logInWithGoogle = async () => {

		try {
			
			await GoogleSignin.signIn();
            const { idToken } = await GoogleSignin.getTokens();

            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            const userCredential = await auth().signInWithCredential(googleCredential);

            if (userCredential.user) {
                router.push("/Classes");
            }

            
		} catch (err: any) {
			Alert.alert("Error", 'Failed to log in with Google. Please try again.');
		}

	};

	const logInWithEmailAndPassword = async () => {

		setLogInLoading(true);

		try {

			await signInWithEmailAndPassword(auth(firebaseApp), email, password);
			router.push("/Classes");

		} catch (err: any) {

			switch (err.code) {
				case "auth/wrong-password":
					Alert.alert("Error", "Incorrect password. Please try again.");
					break;
				case "auth/user-not-found":
					Alert.alert("Error", "No account found with this email.");
					break;
				case "auth/invalid-email":
					Alert.alert("Error", "Please enter a valid email address.");
					break;
				default:
					Alert.alert("Error", "Failed to log in. Please try again.");
			}

		}

		setLogInLoading(false);

	};

	return (

		<View style={styles.container}>

			<Image
				source={require("../assets/logo.png")}
				style={styles.logoImage}
				resizeMode="cover"
			/>

			<Text style={styles.logInText}>
				Log In
			</Text>

			<Text style={styles.welcomeText}>
				Welcome to Ballista! Please log in!
			</Text>

			<Input
				label="Email"
				placeholder="Email"
				iconName="mail"
				textContentType="emailAddress"
				style={{ marginBottom: 20 }}
				value={email}
				setValue={setEmail}
			/>

			<Input
				label="Password"
				placeholder="Password"
				iconName="lock-closed-outline"
				textContentType="password"
				style={{ marginBottom: 20 }}
				value={password}
				setValue={setPassword}
			/>

			<Button 
				iconName="person-outline" 
				onPress={logInWithEmailAndPassword}
				disabled={logInLoading || !email || !password}
			>
				Log In
			</Button>

			<Separator label="or" style={{ marginVertical: 24 }} />

			<View style={styles.externalLogInProviderContainer}>

				<Button
					type="secondary"
					iconName="logo-google"
					iconSize={20}
					style={styles.externalLogInProviderButton}
					onPress={logInWithGoogle}
				/>

				<Button
					type="secondary"
					iconName="logo-apple"
					iconSize={20}
					style={styles.externalLogInProviderButton}
				/>

				<Button
					type="secondary"
					iconName="logo-microsoft"
					iconSize={20}
					style={styles.externalLogInProviderButton}
				/>

			</View>

			<Text style={styles.legalDocumentsText}>

				By continuing, you agree to our{" "}

				<Link
					href={"/"}
					style={styles.link}
				>
					Terms of Service
				</Link>

				{" "}and{" "}

				<Link
					href={"/"}
					style={styles.link}
				>
					Privacy Policy
				</Link>.

			</Text>

		</View>

	)

}

const styles = StyleSheet.create({

	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 36
	},

	logoImage: {
		width: 120,
		height: 120,
		marginBottom: 20
	},

	logInText: {
		color: "#fff",
		fontSize: 32,
		fontWeight: "900",
		marginBottom: 10
	},
	welcomeText: {
		color: "#b5b5b5",
		fontSize: 15,
		marginBottom: 30,
		textAlign: "center"
	},

	externalLogInProviderContainer: {
		flexDirection: "row",
		gap: 16
	},
	externalLogInProviderButton: {
		width: 50,
		height: 50
	},

	legalDocumentsText: {
		position: "absolute",
		bottom: 40,
		color: "#b5b5b5",
		textAlign: "center",
		fontSize: 13,
		fontWeight: "300"
	},

	link: {
		textDecorationLine: "underline"
	}

})