import React, { useState } from "react";
import { View, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text, TextInput, Button, HelperText, useTheme } from "react-native-paper";

const API_BASE_URL = "https://your-backend.example.com"; // TODO: set your backend origin

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const canSubmit = emailValid && password.length >= 6 && !submitting;

  const onLogin = async () => {
    setError("");
    setSubmitting(true);
    try {
      // Example call – adjust path & payload to your backend
      // const res = await fetch(`${API_BASE_URL}/auth/login`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // if (!res.ok) throw new Error("Invalid credentials");
      // const data = await res.json();
      // TODO: store token, navigate to app
      alert("Logged in (demo). Wire this to your backend.");
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.headerSpace} />
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={[styles.title, { color: colors.secondary }]}>
            Login
          </Text>
          <Text style={styles.subtitle}></Text>

          <TextInput
            mode="flat"
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <HelperText type={emailValid ? "info" : "error"} visible={email.length > 0 && !emailValid}>
            Enter a valid email address
          </HelperText>

          <TextInput
            mode="flat"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
            right={<TextInput.Icon icon={secure ? "eye-off" : "eye"} onPress={() => setSecure(s => !s)} />}
            style={styles.input}
          />
          <HelperText type="info" visible={password.length > 0 && password.length < 6}>
            Minimum 6 characters
          </HelperText>

          {error ? <HelperText type="error" visible>{error}</HelperText> : null}

          <Button
            mode="contained"
            onPress={onLogin}
            disabled={!canSubmit}
            loading={submitting}
            style={styles.cta}
          >
            Login
          </Button>

          <View style={styles.row}>
            <TouchableOpacity>
              <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.replace("Register")}>
              <Text style={[styles.link, { marginLeft: 16 }]}>New User? Register</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2", padding: 16, justifyContent: "center" },
  headerSpace: { height: 12 },
  card: { borderRadius: 16, paddingVertical: 8 },
  title: { fontWeight: "700", marginBottom: 2 },
  subtitle: { opacity: 0.7, marginBottom: 12 },
  input: { backgroundColor: "transparent", marginTop: 6 },
  cta: { marginTop: 8, borderRadius: 12, paddingVertical: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  link: { textDecorationLine: "underline" },
});
