import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Plotly from "react-native-plotly";

export default function App() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [timer, setTimer] = useState(null);

  const startTimer = () => {
    setElapsed(0);
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsed(((Date.now() - start) / 1000).toFixed(2));
    }, 100);
    setTimer(interval);
  };

  const stopTimer = () => {
    if (timer) clearInterval(timer);
  };

  const uploadPDF = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (result.canceled) return;

    const file = result.assets[0];
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: "application/pdf",
    });

    setLoading(true);
    setStatus("Processing PDF...");
    startTimer();

    try {
      const response = await fetch("http://10.0.0.10:8000/process-pdf", {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      const data = await response.json();
      setChartData(data);
      setStatus("✅ Data extracted successfully!");
    } catch (err) {
      setStatus("❌ Error: " + err.message);
    } finally {
      stopTimer();
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (!chartData) return null;

    const dates = chartData.visits.map(v => v.visit_date);
    const testNames = [...new Set(chartData.visits.flatMap(v => v.records.map(r => r.test_name)))];

    const traces = testNames.map(metric => ({
      x: dates,
      y: chartData.visits.map(v => {
        const record = v.records.find(r => r.test_name === metric);
        return record ? parseFloat(record.value) : null;
      }),
      type: "scatter",
      mode: "lines+markers",
      name: metric,
    }));

    const layout = {
      title: "Health Metrics Over Time",
      xaxis: { title: "Date" },
      yaxis: { title: "Value" },
    };

    return (
      <View style={{ height: 400, width: "100%" }}>
        <Plotly data={traces} layout={layout} />
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>HealthGraph 🩺</Text>
      <Text style={styles.subtitle}>Upload your medical lab report PDF</Text>

      <Button title="Select and Process PDF" onPress={uploadPDF} />

      {loading && <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 10 }} />}
      {status && <Text style={styles.status}>{status}</Text>}

      {elapsed > 0 && loading && <Text>Elapsed Time: {elapsed}s</Text>}

      {chartData && renderChart()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  status: {
    marginTop: 15,
    textAlign: "center",
  },
});
