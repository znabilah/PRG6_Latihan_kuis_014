import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert, ScrollView, Platform
} from 'react-native';

const BASE_URL = 'http://10.1.12.214:8080/api/phonebooks';

export default function DetailScreen({ route, navigation }) {
    const existing = route.params?.contact;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return dateStr.toString().split('T')[0];
    };

    const [firstName,   setFirstName]   = useState(existing?.firstName    || '');
    const [lastName,    setLastName]    = useState(existing?.lastName     || '');
    const [birthDate,   setBirthDate]   = useState(formatDate(existing?.birthDate) || '');
    const [phoneNumber, setPhoneNumber] = useState(existing?.phoneNumber  || '');
    const [status, setStatus] = useState(Number(existing?.status) || 2);
    const [address,     setAddress]     = useState(existing?.address      || '');

    const handleSave = async () => {
        const body = { firstName, lastName, birthDate: formatDate(birthDate), phoneNumber, status: Number(status), address };
        try {
            if (existing) {
                await fetch(`${BASE_URL}/${existing.idContact}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                Alert.alert('Sukses', 'Kontak berhasil diupdate');
            } else {
                await fetch(BASE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                Alert.alert('Sukses', 'Kontak berhasil ditambahkan');
            }
            navigation.goBack();
        } catch (error) {
            console.error('Gagal simpan:', error);
        }
    };

    const handleDelete = async() => {
  const konfirmasi = window.confirm(`Yakin ingin menghapus ${existing.firstName}?`);
    if (!konfirmasi) return;

    try {
        const response = await fetch(`${BASE_URL}/${existing.idContact}`, { method: 'DELETE' });
        console.log('Response status:', response.status);
        if (response.ok) {
            window.alert('Kontak berhasil dihapus');
            navigation.goBack();
        } else {
            window.alert(`Gagal hapus, status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error.message);
        window.alert('Error: ' + error.message);
    }
    
  Alert.alert(
    'Konfirmasi Hapus',
    `Yakin ingin menghapus "${firstName} ${lastName}"?`,
    [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            console.log('Menghapus ID:', existing.idContact);
            
            const response = await fetch(`${BASE_URL}/api/phonebooks/${existing.idContact}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            console.log('Response status:', response.status);
            
            if (response.ok || response.status === 204) {
              Alert.alert('Sukses', 'Data berhasil dihapus!');
              navigation.goBack();
            } else {
              const errorText = await response.text();
              console.log('Error:', errorText);
              Alert.alert('Error', `Gagal menghapus: ${response.status}`);
            }
          } catch (error) {
            console.log('Catch error:', error);
            Alert.alert('Error', 'Tidak dapat terhubung ke server: ' + error.message);
          }
        },
      },
    ]
  );
};

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="{true}">

            <View style={styles.card}>
                <View style={styles.fieldGroup}>
                    <View style={styles.fieldRow}>
                        <View style={[styles.field, { marginRight: 8 }]}>
                            <Text style={styles.label}>First Name</Text>
                            <TextInput
                                style={styles.input}
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="Budi"
                                placeholderTextColor="#CCC"
                            />
                        </View>
                        <View style={styles.field}>
                            <Text style={styles.label}>Last Name</Text>
                            <TextInput
                                style={styles.input}
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Santoso"
                                placeholderTextColor="#CCC"
                            />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.label}>Birth Date</Text>
                    <TextInput
                        style={styles.input}
                        value={birthDate}
                        onChangeText={setBirthDate}
                        placeholder="2000-01-01"
                        placeholderTextColor="#CCC"
                    />

                    <View style={styles.divider} />

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="numeric"
                        placeholder="08xxxxxxxxxx"
                        placeholderTextColor="#CCC"
                    />

                    <View style={styles.divider} />

                    <Text style={styles.label}>Status</Text>
                    <View style={styles.statusRow}>
                        <TouchableOpacity
                            style={[styles.statusBtn, status === 1 && styles.statusBtnM]}
                            onPress={() => setStatus(1)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.statusBtnText, status === 1 && styles.statusBtnTextM]}>
                                Married
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.statusBtn, status === 2 && styles.statusBtnS]}
                            onPress={() => setStatus(2)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.statusBtnText, status === 2 && styles.statusBtnTextS]}>
                                Single
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={[styles.input, styles.inputMultiline]}
                        value={address}
                        onChangeText={setAddress}
                        multiline
                        placeholder="Jl. ..."
                        placeholderTextColor="#CCC"
                        textAlignVertical="top"
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
                <Text style={styles.saveButtonText}>{existing ? 'Update Kontak' : 'Simpan Kontak'}</Text>
            </TouchableOpacity>

            {existing && (
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.85}>
                    <Text style={styles.deleteButtonText}>Hapus Kontak</Text>
                </TouchableOpacity>
            )}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8F6' },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        overflow: 'hidden',
    },
    fieldGroup: { padding: 16 },
    fieldRow: { flexDirection: 'row' },
    field: { flex: 1 },
    divider: { height: 1, backgroundColor: '#F3F3F3', marginVertical: 12 },
    label: { fontSize: 12, fontWeight: 'bold', color: '#2b2828', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: {
        fontSize: 15,
        color: '#1f2020',
        paddingVertical: 6,
        paddingHorizontal: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
        backgroundColor: 'transparent',
    },
    inputMultiline: {
        height: 80,
        borderBottomWidth: 0,
    },
    statusRow: { flexDirection: 'row', gap: 10 },
    statusBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
    },
    statusBtnM: { backgroundColor: '#FFF3D6', borderColor: '#F5A623' },
    statusBtnS: { backgroundColor: '#EAF3DE', borderColor: '#4CAF50' },
    statusBtnText: { fontSize: 14, fontWeight: '600', color: '#AAAAAA' },
    statusBtnTextM: { color: '#BA7517' },
    statusBtnTextS: { color: '#3B6D11' },
    saveButton: {
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: '#f8ce26',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: { color: '#000000', fontWeight: '600', fontSize: 15 },
    deleteButton: {
        marginHorizontal: 16,
        marginTop: 10,
        backgroundColor: '#f02020',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FF3B30',
    },
    deleteButtonText: { color: '#090909', fontWeight: '600', fontSize: 15 },
});