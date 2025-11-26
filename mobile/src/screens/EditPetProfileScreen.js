// EditPetProfile.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";

export default function EditPetProfileScreen({ navigation }) {
  const [petName, setPetName] = useState("");
  const [dob, setDob] = useState("");
  const [breed, setBreed] = useState("");
  const [vet, setVet] = useState("");
  const [microchip, setMicrochip] = useState("");

  const handleSave = () => {
    // TODO: connect to Node.js API
    Alert.alert("Saved", "Pet profile updated");
  };

  const handleDeactivate = () => {
    Alert.alert("Deactivate Pet", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Deactivate", style: "destructive", onPress: () => {} },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f4a5a" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack && navigation.goBack()}
            >
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Edit Pet</Text>
            <View style={styles.headerArc} />

            {/* Pet image */}
            <View style={styles.petWrapper}>
             {/* <Image
                source={require("./assets/pet-placeholder.jpg")} // add a husky image here if you want
                style={styles.petImage}
              /> */}
              <TouchableOpacity style={styles.editIcon}>
                <Text style={{ fontWeight: "700" }}>✎</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.petType}>Dog</Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            <Text style={styles.label}>Pet’s Name</Text>
            <TextInput
              style={styles.input}
              value={petName}
              onChangeText={setPetName}
              placeholder="Name"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={dob}
              onChangeText={setDob}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Breed</Text>
            <TextInput
              style={styles.input}
              value={breed}
              onChangeText={setBreed}
              placeholder="Breed"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Primary Vet</Text>
            <View style={styles.inputWithIcon}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={[styles.input, { paddingLeft: 34 }]}
                value={vet}
                onChangeText={setVet}
                placeholder="Search or enter vet name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <Text style={styles.label}>Microchip ID</Text>
            <TextInput
              style={styles.input}
              value={microchip}
              onChangeText={setMicrochip}
              placeholder="ID"
              placeholderTextColor="#9ca3af"
            />

            {/* Buttons */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDeactivate}>
                <Text style={styles.deactivateText}>Deactivate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
    paddingBottom: 86,
    backgroundColor: "#1F6578",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 18,
    backgroundColor: "#A6C000",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backText: { fontSize: 18, fontWeight: "700" },
  headerTitle: {
    marginTop: 10,
    backgroundColor: "#ffffff",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 4,
    fontWeight: "700",
    fontSize: 18,
  },
  headerArc: {
    position: "absolute",
    bottom: -120,
    left: 0,
    right: 0,
    height: 240,
    backgroundColor: "#1F6578",
    borderBottomLeftRadius: 240,
    borderBottomRightRadius: 240,
  },
  petWrapper: {
    position: "absolute",
    bottom: -46,
    alignSelf: "center",
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "#f2a62a",
  },
  editIcon: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  petType: {
    marginTop: 60,
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
  },
  form: {
    marginTop: 24,
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
  },
  label: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 14,
    fontSize: 16,
  },
  inputWithIcon: {
    marginBottom: 14,
  },
  searchIcon: {
    position: "absolute",
    left: 10,
    top: 11,
    opacity: 0.6,
  },
  buttonsRow: {
    marginTop: 8,
    marginBottom: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#16495B",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
  },
  saveText: { color: "#ffffff", fontWeight: "700" },
  deactivateText: { color: "#B91C1C", fontWeight: "600" },
});
