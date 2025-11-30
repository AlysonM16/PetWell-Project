import React, { useState } from "react";
import { View, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity } from "react-native";
import {Ionicons} from '@expo/vector-icons';
const API_BASE_URL = "https://your-backend.example.com"; // TODO: set your backend origin

export default function PetProfileScreen({navigation}){
  const dog={
    //connect to backend. hardcoded
    name:"Dog C.",
    breed:"Siberia Husky",
    sex:"Female",
    dob:"10/25/2022 (3)",
    weight:"50.4 lbs"
};

return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrove-back" size={22} color="#fff" />
          </TouchableOpacity>
        <Text style={styles.title}>Dog Name</Text>
    </View>
    <View style={styles.imageContainer}>
      <Image source={dog.image} styles={styles.image}/>
    </View>
    <ScrollView contentContainerStyle={styles.infoContainer}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Dog's Information</Text>
          <TouchableOpacity>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>    
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Breed</Text>
          <Text style={styles.value}>{dog.breed}</Text>
        </View>
        <View style={styles.infoRow}>
            <Text style={styles.label}>Sex</Text>
            <Text style={styles.value}>{dog.sex}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date of Birth</Text>
            <Text style={styles.value}>{dog.dob}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Weight</Text>
            <Text style={styles.value}>{dog.weight}</Text>
          </View>
      </View>
      <View style={styles.labSection}>
          <Text style={styles.labTitle}>Lab Records</Text>
          <Ionicons name="arrow-forward" size={20} color="#000" />
        </View>
        <View style={styles.notesBox}>
          <Text style={styles.notesPlaceholder}>Notes</Text>
        </View>
    </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Upload New File</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
);
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#b3c000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  backButton: { marginRight: 10 },
  title: { fontSize: 20, fontWeight: '700', color: '#000', flex: 1, textAlign: 'center', marginRight: 30 },
  imageContainer: {
    alignItems: 'center',
    marginTop: -30,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'orange',
  },
  infoContainer: {
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    width: '100%',
    padding: 15,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: { fontWeight: '600', fontSize: 16 },
  editText: { color: '#007bff' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: { color: '#555' },
  value: { fontWeight: '500' },
  labSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  labTitle: { fontWeight: '600' },
  notesBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  notesPlaceholder: { color: '#aaa' },
  bottomNav: {
    backgroundColor: '#003c4f',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  navItem: { alignItems: 'center' },
  navText: { color: '#fff', fontSize: 12, marginTop: 2 },
});
