import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors["dark"].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: {
                    backgroundColor: "#161616",
                    borderTopColor: "#595959"
                },
                sceneStyle: {
                    backgroundColor: "#0a0a0a"
                }
            }}>
            <Tabs.Screen
                name="Classes"
                options={{
                    title: 'Classes',
                    tabBarIcon: ({ color }) => <Ionicons name='school' size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="Assessments"
                options={{
                    title: 'Assessments',
                    tabBarIcon: ({ color }) => <Ionicons name='document-outline' size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="Profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <Ionicons name='person-circle-outline' size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
