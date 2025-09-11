import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/api/apiClient';
import * as ImagePicker from 'expo-image-picker';

interface ProfileForm {
    name: string; 
    age: string; 
    program: string; 
    year: string;
    prompts: { q: string; a: string }[]; 
    photos: string[];
}

export default function ProfileScreen() {
    const { token, logout } = useAuth();
    const [profile, setProfile] = useState<ProfileForm>({ name: '', age: '', program: '', year: '', prompts: [], photos: [] });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return;
            try {
                const response = await apiClient.get('/api/profile/me', { headers: { Authorization: `Bearer ${token}` } });
                if (response.data) {
                    setProfile({
                        name: response.data.name || '', 
                        age: response.data.age?.toString() || '',
                        program: response.data.program || '', 
                        year: response.data.year || '',
                        prompts: response.data.prompts || [], 
                        photos: response.data.photos || [],
                    });
                }
            } catch (error) { 
                Alert.alert("Error", "Could not fetch your profile."); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchProfile();
    }, [token]);

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, 
            allowsEditing: true,
            aspect: [3, 4], 
            quality: 0.7,
        });
        if (result.canceled) return;
        
        setIsSaving(true);
        try {
            const urlResponse = await apiClient.get('/api/profile/upload-url', { headers: { Authorization: `Bearer ${token}` } });
            const { uploadUrl, publicUrl } = urlResponse.data;
            
            const response = await fetch(result.assets[0].uri);
            const blob = await response.blob();
            
            await fetch(uploadUrl, { method: 'PUT', body: blob, headers: { 'Content-Type': 'image/jpeg' } });
            
            setProfile(current => ({...current, photos: [...current.photos, publicUrl] }));
        } catch (error) { 
            Alert.alert("Upload Failed", "Could not upload photo."); 
        } finally { 
            setIsSaving(false); 
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const payload = { ...profile, age: parseInt(profile.age) || undefined };
            await apiClient.put('/api/profile/me', payload, { headers: { Authorization: `Bearer ${token}` } });
            Alert.alert("Success!", "Your profile has been saved.");
        } catch (error) { 
            Alert.alert("Error", "Could not save your profile."); 
        } finally { 
            setIsSaving(false); 
        }
    };
    
    const handleAddPrompt = () => {
        if (profile.prompts.length < 3) {
            setProfile(current => ({
                ...current,
                prompts: [...current.prompts, { q: 'A random fact I love is...', a: '' }],
            }));
        }
    };

    const handlePromptChange = (index: number, field: 'q' | 'a', value: string) => {
        const updatedPrompts = [...profile.prompts];
        updatedPrompts[index][field] = value;
        setProfile(current => ({ ...current, prompts: updatedPrompts }));
    };


    if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Your Profile</Text>
            
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={profile.name} onChangeText={t => setProfile({...profile, name: t})} />
            
            <Text style={styles.label}>Age</Text>
            <TextInput style={styles.input} value={profile.age} onChangeText={t => setProfile({...profile, age: t})} keyboardType="numeric"/>
            
            <Text style={styles.label}>Program</Text>
            <TextInput style={styles.input} value={profile.program} onChangeText={t => setProfile({...profile, program: t})} />
            
            <Text style={styles.label}>Year</Text>
            <TextInput style={styles.input} value={profile.year} onChangeText={t => setProfile({...profile, year: t})} />
            
            <Text style={styles.label}>Prompts</Text>
            {profile.prompts.map((prompt, index) => (
                <View key={index} style={styles.promptContainer}>
                    <TextInput style={styles.input} value={prompt.q} onChangeText={text => handlePromptChange(index, 'q', text)} />
                    <TextInput style={[styles.input, styles.promptAnswer]} value={prompt.a} onChangeText={text => handlePromptChange(index, 'a', text)} multiline />
                </View>
            ))}
            {profile.prompts.length < 3 && <Button title="Add Prompt" onPress={handleAddPrompt} />}

            <Text style={styles.label}>Photos</Text>
            <View style={styles.photoGrid}>
                {profile.photos.map(uri => <Image key={uri} source={{ uri }} style={styles.photo} />)}
                {profile.photos.length < 6 && (
                    <TouchableOpacity style={styles.addPhotoButton} onPress={handlePickImage} disabled={isSaving}>
                        <Text style={styles.addPhotoText}>+</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <Button title={isSaving ? "Saving..." : "Save Profile"} onPress={handleSaveProfile} disabled={isSaving} />
            </View>
            <View style={styles.buttonContainer}>
                 <Button title="Logout" onPress={logout} color="red" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 50 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '500', marginTop: 15, marginBottom: 5 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, fontSize: 16, backgroundColor: '#fff' },
    photoGrid: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 20, gap: 10 },
    photo: { width: 100, height: 100, borderRadius: 8, backgroundColor: '#eee' },
    addPhotoButton: { width: 100, height: 100, borderRadius: 8, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
    addPhotoText: { fontSize: 40, color: '#aaa' },
    buttonContainer: { marginTop: 20 },
    promptContainer: { marginBottom: 15, gap: 5 },
    promptAnswer: { minHeight: 80, textAlignVertical: 'top' },
});

