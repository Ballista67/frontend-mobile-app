import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import React, { ComponentProps } from "react";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

interface ButtonProps {
    children?: string;
    onPress?: () => void;
    disabled?: boolean;
    iconName?: IoniconName;
    iconSize?: number;
    type?: "primary" | "secondary";
    style?: object;
}

export function Button({ children, onPress, disabled = false, iconName, iconSize, type = "primary", style }: ButtonProps) {

    return (
        <TouchableOpacity
            style={[
                type === "primary" ?
                    styles.primaryContainer :
                    styles.secondaryContainer,
                disabled && styles.disabledContainer,
                style
            ]}
            onPress={onPress}
            disabled={disabled}
        >

            {children && (
                <Text style={styles.labelText}>
                    {children}
                </Text>
            )}

            {iconName && (
                <Ionicons
                    name={iconName}
                    size={iconSize || 15}
                    color="#959595"
                    style={styles.ionicons}
                />
            )}

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    primaryContainer: {
        height: 40,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        backgroundColor: "#5763d8",
        flexDirection: "row",
        gap: 10
    },

    secondaryContainer: {
        height: 40,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        borderColor: "#595959",
        backgroundColor: "#181818",
        flexDirection: "row",
        gap: 10,
        borderWidth: 0.5
    },

    disabledContainer: {
        opacity: 0.5
    },

    labelText: {
        color: "#fff"
    },

    ionicons: {
        color: "#fff"
    }

})