import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListScreen from './pages/ListScreen';
import DetailScreen from './pages/DetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="ListScreen">
                <Stack.Screen
                    name="ListScreen"
                    component={ListScreen}
                    options={({ navigation }) => ({

                        title: 'Phonebooks Apps',
                        container: { flex: 1, backgroundColor: '#F8F8F6' },
                        headerStyle: { backgroundColor: '#fff' },
                        headerTitleStyle: { fontWeight: '700', fontSize: 17, color: '#1A1A1A' },
                        headerShadowVisible: false,
                        headerRight: () => (
                            <TouchableOpacity
                                style={styles.newButton}
                                onPress={() => navigation.navigate('DetailScreen', { contact: null })}
                            >
                                <Text style={styles.newButtonText}>+ New</Text>
                            </TouchableOpacity>
                        ),
                    })}
                />
                <Stack.Screen
                    name="DetailScreen"
                    component={DetailScreen}
                    options={{
                        title: 'Detail Kontak',
                        headerStyle: { backgroundColor: '#fff' },
                        headerTitleStyle: { fontWeight: '700', fontSize: 17, color: '#1A1A1A' },
                        headerShadowVisible: false,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    newButton: {
        backgroundColor: '#1192e8',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 8,
    },
    newButtonText: { color: '#fff', fontWeight: '600', fontSize: 13 },
});