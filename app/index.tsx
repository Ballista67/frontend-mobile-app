import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Separator } from "@/components/Separator";
import { getApp } from "@react-native-firebase/app";
import auth, { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from "@react-native-firebase/firestore";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { useState, useEffect } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';

export default function LogIn() {

	const searchParams = useLocalSearchParams();
	const authMode = searchParams.authMode || "logIn";

	const router = useRouter();

	const firebaseApp = getApp();
	const db = getFirestore();

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const [signUpAccountType, setSignUpAccountType] = useState<"student" | "teacher" | null>(null);

	const [disableEmailAuth, setDisableEmailAuth] = useState<boolean>(false);
	const [disableExternalProviderAuth, setDisableExternalProviderAuth] = useState<boolean>(false);

	useEffect(() => {
		GoogleSignin.configure({
			webClientId: "824192608993-vi9bicl7vu7flrpmgcp1q6r6m0pv366f.apps.googleusercontent.com"
		});
	}, []);

	useEffect(() => {

		if (authMode === "signUp" && !signUpAccountType) {
			setDisableExternalProviderAuth(true);
		}

		else {
			setDisableExternalProviderAuth(false);
		}

	}, [authMode, signUpAccountType])

	const authWithGoogle = async () => {

		try {

			await GoogleSignin.signIn();
			const { idToken } = await GoogleSignin.getTokens();

			const googleCredential = auth.GoogleAuthProvider.credential(idToken);
			const userCredential = await auth().signInWithCredential(googleCredential);

			if (authMode === "signUp") {
				await setDoc(doc(db, "users", userCredential.user.uid), {
					accountType: signUpAccountType
				})
			}

			else {
				const snap = await getDoc(doc(db, "users", userCredential.user.uid));
				if (!snap.exists()) {
					Alert.alert("Error", "No user found with this email. Please sign up.");
					return;
				}
			}


			if (userCredential.user) {
				router.push("/Classes");
			}


		} catch (err: any) {
			Alert.alert("Error", "Failed to authorize with Google. Please try again.");
		}

	};

	const authWithEmailAndPassword = async () => {

		setDisableEmailAuth(true);

		if (authMode === "logIn") {

			try {

				await signInWithEmailAndPassword(auth(firebaseApp), email, password);
				router.push("/Classes");

			} catch (err: any) {

				switch (err.code) {
					case "auth/invalid-credential":
						Alert.alert("Error", "Incorrect email or password. Please try again.");
						break;
					case "auth/invalid-email":
						Alert.alert("Error", "Please enter a valid email address.");
						break;
					default:
						Alert.alert("Error", "Failed to log in. Please try again.");
				}

			}

		}

		else {

			try {

				const userCredential = await createUserWithEmailAndPassword(auth(firebaseApp), email, password);

				await setDoc(doc(db, "users", userCredential.user.uid), {
					accountType: signUpAccountType
				})

				router.push("/Classes");

			} catch (err: any) {

				switch (err.code) {
					case "auth/invalid-email":
						Alert.alert("Error", "Please enter a valid email address.");
						break;
					case "auth/email-already-in-use":
						Alert.alert("Error", "This email address is already in use.");
						break;
					case "auth/weak-password":
						Alert.alert("Error", "Your password must be a minimum of 6 characters.");
						break;
					default:
						Alert.alert("Error", "Failed to sign up. Please try again.");
				}

			}

		}

		setDisableEmailAuth(false);

	};

	return (

		<View style={styles.container}>

			<Image
				source={require("../assets/logo.png")}
				style={styles.logoImage}
				resizeMode="cover"
			/>

			<Text style={styles.authText}>
				{authMode === "logIn" ? "Log In" : "Sign Up"}
			</Text>

			<Text style={styles.welcomeText}>
				Welcome to Ballista! {authMode === "logIn" ? "Please log in." : "Sign up for an account."}
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

			{authMode === "signUp" && (
				<>
					<Text style={styles.accountTypeDropdownLabelText}>
						Account Type
					</Text>
					<Dropdown
						data={[
							{ label: "Student", value: "student" },
							{ label: "Teacher", value: "teacher" }
						]}
						style={styles.accountTypeDropdown}
						labelField="label"
						valueField="value"
						value={signUpAccountType}
						placeholderStyle={{ color: "#b5b5b5" }}
						selectedTextStyle={{ color: "#b5b5b5" }}
						itemTextStyle={{ color: "#000" }}
						onChange={item => setSignUpAccountType(item.value)}
					/>
				</>


			)}

			<Button
				iconName={authMode === "logIn" ? "person-outline" : "person-add-outline"}
				onPress={authWithEmailAndPassword}
				disabled={disableEmailAuth || !email || !password || (authMode === "signUp" && !signUpAccountType)}
			>
				{authMode === "logIn" ? "Log In" : "Sign Up"}
			</Button>

			{authMode === "logIn" ? (
				<Text style={styles.switchAuthModeText}>
					Don't have an account?{" "}
					<Link
						href={{
							pathname: "/",
							params: { authMode: "signUp" }
						}}
						style={styles.switchAuthModeLink}
					>
						Sign up
					</Link>.
				</Text>
			) : (
				<Text style={styles.switchAuthModeText}>
					Already have an account?{" "}
					<Link
						href={{
							pathname: "/",
							params: { authMode: "logIn" }
						}}
						style={styles.switchAuthModeLink}
					>
						Log in
					</Link>.
				</Text>
			)}

			<Separator label="or" style={{ marginVertical: 24 }} />

			<View style={styles.externalAuthProviderContainer}>

				<Button
					type="secondary"
					iconName="logo-google"
					iconSize={20}
					style={styles.externalAuthProviderButton}
					onPress={authWithGoogle}
					disabled={disableExternalProviderAuth}
				/>

				<Button
					type="secondary"
					iconName="logo-apple"
					iconSize={20}
					style={styles.externalAuthProviderButton}
					disabled={disableExternalProviderAuth}
				/>

				<Button
					type="secondary"
					iconName="logo-microsoft"
					iconSize={20}
					style={styles.externalAuthProviderButton}
					disabled={disableExternalProviderAuth}
				/>

			</View>

			<Text style={styles.legalDocumentsText}>

				By continuing, you agree to our{" "}

				<Link
					href={"/"}
					style={styles.legalDocumentsLink}
				>
					Terms of Service
				</Link>

				{" "}and{" "}

				<Link
					href={"/"}
					style={styles.legalDocumentsLink}
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
		paddingTop: 70,
		padding: 32
	},

	logoImage: {
		width: 120,
		height: 120,
		marginBottom: 20
	},

	authText: {
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

	accountTypeDropdown: {
		flexDirection: "row",
		alignItems: "center",
		height: 40,
		borderRadius: 10,
		borderColor: "#595959",
		borderWidth: 0.5,
		paddingHorizontal: 10,
		backgroundColor: "#181818",
		marginBottom: 20
	},
	accountTypeDropdownLabelText: {
		marginBottom: 5,
		fontSize: 16,
		color: "#fff",
		width: "100%"
	},

	switchAuthModeText: {
		color: "#b5b5b5",
		marginTop: 20
	},
	switchAuthModeLink: {
		textDecorationLine: "underline",
		color: "#5763d8"
	},

	externalAuthProviderContainer: {
		flexDirection: "row",
		gap: 16
	},
	externalAuthProviderButton: {
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

	legalDocumentsLink: {
		textDecorationLine: "underline"
	}

})