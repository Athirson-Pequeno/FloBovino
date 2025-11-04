// app/(tabs)/_layout.tsx
import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#00780aff",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#00780a41",
          elevation: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          header: () => <CustomHeader title="Home" />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          header: () => <CustomHeader title="Calendário" />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

function CustomHeader({ title }: { title: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleConvidar = () => {
    setMenuOpen(false);
    console.log("Convidar veterinário");
    router.push("/pages/veterinarios")
  };

  const handleSair = () => {
    setMenuOpen(false);
    console.log("Sair");
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>

      <Pressable onPress={() => setMenuOpen(!menuOpen)} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="#00780aff" />
      </Pressable>

      {menuOpen && (
        <View style={styles.dropdown}>
          <Pressable onPress={handleConvidar} style={styles.dropdownItem}>
            <Text style={styles.dropdownText}>Convidar Veterinário</Text>
          </Pressable>
          <Pressable onPress={handleSair} style={styles.dropdownItem}>
            <Text style={styles.dropdownText}>Sair</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    backgroundColor: "#ffffffff",
    justifyContent: "center",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "left",
    color: "#00780aff",
    fontWeight: "bold",
    fontSize: 16,
  },
  menuButton: {
    padding: 8,
  },
  dropdown: {
    position: "absolute",
    top: 50,
    right: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity:1,
    shadowRadius: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownText: {
    color: "#00780aff",
    fontWeight: "600",
  },
});
