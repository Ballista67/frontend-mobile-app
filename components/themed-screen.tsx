import { StyleSheet, View, ViewProps } from 'react-native';

interface ThemedScreenProps extends ViewProps {
    children: React.ReactNode;
}

export function ThemedScreen({ children, style, ...props }: ThemedScreenProps) {
    return (
        <View 
            style={[styles.container, style]} 
            {...props}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Dark theme background
    },
});