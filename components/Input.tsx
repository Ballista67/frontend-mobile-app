import { Ionicons } from '@expo/vector-icons';
import React, { ComponentProps, Dispatch, SetStateAction } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type IoniconName = ComponentProps<typeof Ionicons>["name"];
type TextInputTextContentType = ComponentProps<typeof TextInput>["textContentType"];

interface InputProps {
	value?: string;
	setValue?: Dispatch<SetStateAction<string>>;
	label: string;
	placeholder: string;
	iconName?: IoniconName;
	textContentType?: TextInputTextContentType;
	style?: object;
}

export function Input({ value, setValue, label, placeholder, iconName, textContentType, style } : InputProps) {

	return (
		<View style={[styles.container, style]}>

			<Text style={styles.labelText}>
				{label}
			</Text>

			<View style={styles.textInputContainer}>

				{iconName && (
					<Ionicons 
						name={iconName}
						size={23} 
						color="#959595" 
						style={styles.textInputIonicons}
					/>
				)}

				<TextInput
					value={value}
					onChangeText={value => setValue?.(value)}
					style={styles.textInput}
					placeholder={placeholder}
					placeholderTextColor="#b5b5b5"
					textContentType={textContentType}
					secureTextEntry={textContentType === "password"}
					keyboardType={textContentType === "oneTimeCode" ? "number-pad" : undefined }
				/>

			</View>
		</View>
	)

}

const styles = StyleSheet.create({

	container: {
		width: "100%",
		gap: 5
	},

	labelText: {
		color: "#fff", 
		fontSize: 16
	},

	textInputContainer: {
		flexDirection: "row",
		alignItems: "center",
		height: 40,
		borderRadius: 10,
		borderColor: "#595959",
		borderWidth: 0.5,
		paddingHorizontal: 10,
		backgroundColor: "#181818"
	},
	textInputIonicons: {
		marginRight: 8,
	},
	textInput: {
		flex: 1,
		color: "#b5b5b5",
	}

})