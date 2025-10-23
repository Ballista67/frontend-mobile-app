import { Image, StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Separator } from "@/components/Separator";
import { Link } from "expo-router";
import { useState } from "react";
// import auth from '@react-native-firebase/auth';

export default function LogIn() {

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	// const logIn = async () => {
	// 	await auth().signInWithEmailAndPassword(email, password);
	// };

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

			<Button iconName="person-outline">
				Log In
			</Button>

			<Separator label="or" style={{ marginVertical: 24 }} />

			<View style={styles.externalLogInProviderContainer}>

				<Button
					type="secondary"
					iconName="logo-google"
					iconSize={20}
					style={styles.externalLogInProviderButton}
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
					//onPress={logIn}
				/>

			</View>

			<Text style={styles.legalDocumentsText}>

				By continuing, you agree to our{" "}

				<Link
					href={"/LogIn"}
					style={styles.link}
				>
					Terms of Service
				</Link>

				{" "}and{" "}

				<Link
					href={"/LogIn"}
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