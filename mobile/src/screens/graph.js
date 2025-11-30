import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Calendar } from "react-native-calendars";
import { Dropdown } from "react-native-element-dropdown";
import Svg, { Polyline, Line, Text as SvgText } from "react-native-svg";
import axios from "axios";

// ================== LINE CHART ======================
function LineChart({ dataSets }) {
  const width = 350;
  const height = 220;
  const padding = 25;

  if (!dataSets || dataSets.length === 0) return null;

  const allY = dataSets.flatMap((ds) => ds.data.map((p) => p.y));
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);

  const scaleX = (i, total) =>
    padding + (i / (total - 1)) * (width - padding * 2);

  const scaleY = (y) =>
    height - padding - ((y - minY) / (maxY - minY)) * (height - padding * 2);

  return (
    <Svg width={width} height={height} style={{ backgroundColor: "#f2f2f2", borderRadius: 12 }}>
      {/* Y Axis */}
      <Line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke="black"
        strokeWidth="2"
      />

      {/* X Axis */}
      <Line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="black"
        strokeWidth="2"
      />

      {/* Lines for each metric */}
      {dataSets.map((set, idx) => {
        const points = set.data
          .map((p, i) => `${scaleX(i, set.data.length)},${scaleY(p.y)}`)
          .join(" ");

        return (
          <Polyline
            key={set.name}
            points={points}
            fill="none"
            stroke={["#1d7fbf", "#ff4d4d", "#00cc88"][idx % 3]}
            strokeWidth="3"
          />
        );
      })}

      {/* Legend */}
      {dataSets.map((set, idx) => (
        <SvgText
          key={set.name}
          x={padding + idx * 110}
          y={padding - 5}
          fill={["#1d7fbf", "#ff4d4d", "#00cc88"][idx % 3]}
          fontSize="14"
        >
          {set.name}
        </SvgText>
      ))}
    </Svg>
  );
}

// ===================== MAIN SCREEN ========================
export default function Graph() {
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [metricsOptions, setMetricsOptions] = useState([]);
  const [labData, setLabData] = useState({}); // analyteName → [{x, y}]
  const [loading, setLoading] = useState(true);

  const [dateRange, setDateRange] = useState({
    start: "2025-01-10",
    end: "2025-12-31",
  });

  // ========= FETCH USER DATA FROM BACKEND =========
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Get logged-in user
        const me = await axios.get("http://192.168.1.157:8000/auth/me");
        const userId = me.data.id;

        // 2. Get patient profile linked to user
        const patient = await axios.get(`http://192.168.1.157:8000/patients/by_user/${userId}`);
        const patientId = patient.data.id;

        // 3. Get all results for this patient
        const results = await axios.get(`http://192.168.1.157:8000/patients/${patientId}/results`);

        // Format data: analyte_name → [{x: date, y: value}]
        const grouped = {};

        results.data.forEach((r) => {
          if (!grouped[r.analyte_name]) grouped[r.analyte_name] = [];

          grouped[r.analyte_name].push({
            x: r.collected_at.split("T")[0],
            y: r.value_numeric,
          });
        });

        // Sort each analyte by date
        Object.keys(grouped).forEach((k) => {
          grouped[k].sort((a, b) => new Date(a.x) - new Date(b.x));
        });

        setLabData(grouped);

        // Build dropdown options
        setMetricsOptions(
          Object.keys(grouped).map((name) => ({ label: name, value: name }))
        );

        // Auto-select first two metrics
        setSelectedMetrics(Object.keys(grouped).slice(0, 2));
      } catch (err) {
        console.log("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1d7fbf" />
        <Text>Loading lab results...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Pet</Text>
        <Image
          source={{ uri: "https://place-puppy.com/200x200" }}
          style={styles.avatar}
        />
      </View>

      {/* CHART */}
      <View style={{ marginTop: 60, alignItems: "center" }}>
        <LineChart
          dataSets={selectedMetrics.map((m) => ({
            name: m,
            data: labData[m] || [],
          }))}
        />
      </View>

      {/* SELECTED METRICS */}
      <View style={styles.metricList}>
        {selectedMetrics.map((m) => (
          <View key={m} style={styles.metricRow}>
            <View className="dot" style={styles.dot} />
            <Text style={styles.metricText}>{m}</Text>
          </View>
        ))}
      </View>

      {/* METRIC DROPDOWN */}
      <Text style={styles.sectionTitle}>Metrics</Text>
      <Dropdown
        data={metricsOptions}
        value={selectedMetrics}
        labelField="label"
        valueField="value"
        multiple={true}
        placeholder="Select metrics"
        onChange={(items) => setSelectedMetrics(items.map((i) => i.value))}
        style={styles.dropdown}
      />

      {/* DATE RANGE */}
      <Text style={styles.sectionTitle}>Date Range</Text>
      <Calendar
        markingType="period"
        markedDates={{
          [dateRange.start]: {
            startingDay: true,
            color: "#1d7fbf",
            textColor: "#fff",
          },
          [dateRange.end]: {
            endingDay: true,
            color: "#1d7fbf",
            textColor: "#fff",
          },
        }}
        onDayPress={(day) =>
          setDateRange((prev) => ({ ...prev, end: day.dateString }))
        }
      />
    </ScrollView>
  );
}

// =================== STYLES =====================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: "#1d7fbf",
    height: 160,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },

  headerText: { fontSize: 24, color: "#fff", fontWeight: "bold" },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#fff",
    position: "absolute",
    bottom: -40,
  },

  metricList: { padding: 20, marginTop: 50 },

  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1d7fbf",
    marginRight: 10,
  },

  metricText: { fontSize: 16 },

  sectionTitle: {
    paddingHorizontal: 20,
    fontSize: 18,
    marginTop: 10,
    fontWeight: "600",
  },

  dropdown: {
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
});
