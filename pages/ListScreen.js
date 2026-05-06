import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    StyleSheet, ActivityIndicator
} from 'react-native';

const BASE_URL = 'http://10.1.12.214:8080/api/phonebooks';

export default function ListScreen({ navigation }) {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await fetch(BASE_URL);
            const data = await response.json();
            const normalized = data.map(item => ({
                ...item,
                status: Number(item.status),
            }));

            setContacts(normalized);
        } catch (error) {
            console.error('Gagal fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchContacts);
        return unsubscribe;
    }, [navigation]);

   const renderItem = ({ item, index }) => (

        <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('DetailScreen', { contact: item })}
        >
            <View style={styles.numberBox}>
                <Text style={styles.number}>{index + 1}</Text>
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
                <Text style={styles.phone}>{item.phoneNumber}</Text>
            </View>
            <View style={[styles.badge, item.status === '1' ? styles.badgeM : styles.badgeS]}>
                <Text style={[styles.badgeText, item.status === '1' ? styles.badgeTextM : styles.badgeTextS]}>
                    {item.status === '1' ? 'M' : 'S'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B6D11" />
            <Text style={styles.loadingText}>Memuat kontak...</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={contacts}
                keyExtractor={(item) => item.idContact.toString()}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8F6' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center'},
    loadingText: { fontSize: 14, color: '#888' },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#fff',
    },
    numberBox: {
        width: 28,
        marginRight: 12,
        alignItems: 'center',
    },
    number: {
        fontSize: 14,
        fontWeight: '600',
        color: '#AAAAAA',
    },
    info: { flex: 1 },
    name: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
    phone: { fontSize: 13, color: '#999', marginTop: 3 },
    badge: {
        width: 34,
        height: 34,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeM: { backgroundColor: '#f2c355' },
    badgeS: { backgroundColor: '#29a11c' },
    badgeText: { fontWeight: '700', fontSize: 15 },
    badgeTextM: { color: '#f5f4f4' },
    badgeTextS: { color: '#f5f5f5' },
    separator: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 56 },
});