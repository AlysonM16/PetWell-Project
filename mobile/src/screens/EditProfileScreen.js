// EditProfile.js
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

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdate = () => {
    // TODO: call your Node.js API here
    if (password && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    Alert.alert("Updated", "Profile updated successfully");
  };

  const handleDelete = () => {
    // TODO: call your delete-account API
    Alert.alert("Delete Account", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => {} },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f4a5a" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          {/* TOP HEADER WITH ARC */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack && navigation.goBack()}
            >
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Edit Profile</Text>

            <View style={styles.headerArc} />

            {/* Avatar */}
            <View style={styles.avatarWrapper}>
              {/*<Image
                source={require("./assets/user-placeholder.jpg")} // put an image in /assets
                style={styles.avatar}
              />*/}
              <TouchableOpacity style={styles.editIcon}>
                <Text style={{ fontWeight: "700" }}>✎</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="you@email.com"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+1 555 000 0000"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="New password"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.label}>Re-Enter Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Re-enter password"
              placeholderTextColor="#9ca3af"
            />

            {/* Buttons row */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <Text style={styles.updateText}>Update</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDelete}>
                <Text style={styles.deleteText}>Delete Account</Text>
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
    paddingBottom: 70,
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
  backText: {
    fontSize: 18,
    fontWeight: "700",
  },
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
  avatarWrapper: {
    position: "absolute",
    bottom: -46,
    alignSelf: "center",
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#d9e4f2",
  },
  editIcon: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  form: {
    marginTop: 60,
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
  buttonsRow: {
    marginTop: 12,
    marginBottom: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  updateButton: {
    backgroundColor: "#16495B",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
  },
  updateText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  deleteText: {
    color: "#B91C1C",
    fontWeight: "600",
  },
});
