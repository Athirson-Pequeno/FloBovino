import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="pages/login" />
        <Stack.Screen name="pages/homes" />
        <Stack.Screen name="pages/loginFazendeiro" />
        <Stack.Screen name="forms/formularioAnimal" />
        <Stack.Screen name="forms/formularioFazendeiro" />
        <Stack.Screen name="forms/formularioVeterinario" />
        <Stack.Screen name="pages/fazendeiros" />
        <Stack.Screen name="pages/veterinarios" />
        <Stack.Screen name="pages/dashboardFazendeiro" />
      </Stack>
    </ThemeProvider>
  );
}
