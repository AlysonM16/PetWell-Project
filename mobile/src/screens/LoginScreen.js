// src/screens/LoginScreen.js
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Card, Text as PText, TextInput as PTextInput, Button as PButton, HelperText as PHelperText } from "react-native-paper";
import { useAuth } from "../AuthContext";

export default function LoginScreen({ navigation }) {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const passValid = password.length >= 6;

  const onLogin = async () => {
    try {
      if (!emailValid || !passValid) {
        Alert.alert("Invalid input", "Enter a valid email and a password with at least 6 characters.");
        return;
      }
      await login(email.trim(), password);
      // Root will switch to Upload after AuthContext sets user
    } catch (e) {
      Alert.alert("Login failed", e?.response?.data?.detail || e.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.root}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <PText variant="titleLarge" style={styles.title}>Login</PText>

          <PTextInput
            mode="flat"
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <PHelperText type={emailValid ? "info" : "error"} visible={email.length > 0 && !emailValid}>
            Enter a valid email
          </PHelperText>

          <PTextInput
            mode="flat"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <PHelperText type="info" visible={password.length > 0 && !passValid}>
            Minimum 6 characters
          </PHelperText>

          <PButton
            mode="contained"
            onPress={onLogin}
            disabled={loading || !emailValid || !passValid}
            loading={loading}
            style={styles.cta}
          >
            Sign In
          </PButton>

          <TouchableOpacity onPress={() => navigation.replace("Register")} style={{ alignSelf: "center", marginTop: 8 }}>
            <PText style={{ textDecorationLine: "underline" }}>New user? Register</PText>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F2F2F2", padding: 16, justifyContent: "center" },
  card: { borderRadius: 16, paddingVertical: 8 },
  title: { fontWeight: "700", marginBottom: 12, color: "#0a7" },
  input: { backgroundColor: "transparent", marginTop: 6 },
  cta: { marginTop: 12, borderRadius: 12, paddingVertical: 6, backgroundColor: "#0a7" },
});
