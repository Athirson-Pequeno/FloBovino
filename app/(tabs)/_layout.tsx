import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      {/* Calendário -> rota 'explore' (arquivo app/explore.tsx) */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Calendário",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
        }}
      />

      {/* Oculta a aba do formulário, mas mantém a rota ativa */}
      <Tabs.Screen
        name="formularioAnimal"
        options={{ href: null }}
      />
      {/* Oculta a aba do formulário, mas mantém a rota ativa */}
      <Tabs.Screen
        name="formularioFazendeiro"
        options={{ href: null }}
      />
      {/* Oculta a aba do formulário, mas mantém a rota ativa */}
      <Tabs.Screen
        name="formularioVeterinario"
        options={{ href: null }}
      />
    </Tabs>
  );
}