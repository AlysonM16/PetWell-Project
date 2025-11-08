import React, { useState } from "react";
import { View, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text, TextInput, Button, HelperText, useTheme } from "react-native-paper";

const API_BASE_URL = "https://your-backend.example.com"; // TODO: set your backend origin

export default function RegisterScreen({ navigation }) {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const passValid = password.length >= 6;
  const match = passValid && password === confirm;
  const canSubmit = name.trim() && emailValid && match && !submitting;

  const onRegister = async () => {
    setError("");
    setSubmitting(true);
    try {
      // Example call – adjust path & payload to your backend
      // const res = await fetch(`${API_BASE_URL}/auth/register`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, email, password }),
      // });
      // if (!res.ok) throw new Error("Unable to register");
      // const data = await res.json();
      alert("Account created (demo). Wire this to your backend.");
      navigation.replace("Login");
    } catch (e) {
      setError(e.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.headerBlob} />
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={[styles.title, { color: colors.secondary }]}>
            Registration
          </Text>

          <TextInput
            mode="flat"
            label="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            mode="flat"
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <HelperText type="error" visible={email.length > 0 && !emailValid}>
            Enter a valid email
          </HelperText>

          <TextInput
            mode="flat"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure1}
            right={<TextInput.Icon icon={secure1 ? "eye-off" : "eye"} onPress={() => setSecure1(s => !s)} />}
            style={styles.input}
          />
          <HelperText type="info" visible={password.length > 0 && !passValid}>
            Minimum 6 characters
          </HelperText>

          <TextInput
            mode="flat"
            label="Re-type Password"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry={secure2}
            right={<TextInput.Icon icon={secure2 ? "eye-off" : "eye"} onPress={() => setSecure2(s => !s)} />}
            style={styles.input}
          />
          <HelperText type={match ? "info" : "error"} visible={confirm.length > 0 && !match}>
            Passwords don't match
          </HelperText>

          {error ? <HelperText type="error" visible>{error}</HelperText> : null}

          <Button
            mode="contained"
            onPress={onRegister}
            disabled={!canSubmit}
            loading={submitting}
            style={styles.cta}
          >
            Create Account
          </Button>

          <View style={styles.row}>
            <TouchableOpacity onPress={() => navigation.replace("Login")}>
              <Text style={styles.link}>Have an account? Login</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2", padding: 16, justifyContent: "center" },
  headerBlob: { height: 8 },
  card: { borderRadius: 16, paddingVertical: 8 },
  title: { fontWeight: "700", marginBottom: 12 },
  input: { backgroundColor: "transparent", marginTop: 6 },
  cta: { marginTop: 12, borderRadius: 12, paddingVertical: 6 },
  row: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
  link: { textDecorationLine: "underline" },
});
