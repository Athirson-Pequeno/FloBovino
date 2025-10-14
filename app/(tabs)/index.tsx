import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

type Animal = {
  id: string;
  nome: string;
  idade: string;
};

const data: Animal[] = [
  { id: "1", nome: "Raposinha", idade: "3 anos" },
  { id: "2", nome: "Trezeana", idade: "5 anos" },
  { id: "3", nome: "Lua nova", idade: "2 anos" },
];

export default function HomeScreen() {
  const renderItem = ({ item }: { item: Animal }) => (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Cow_female_black_white.jpg",
          }}
          style={styles.image}
          contentFit="cover"
        />
        <View>
          <Text style={styles.name}>{item.nome}</Text>
          <Text style={styles.age}>{item.idade}</Text>
        </View>
      </View>

      <IconSymbol size={28} name="calendar" color={"#fff"} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Lista de animais */}
      <FlatList
        data={data}
        keyExtractor={(animal) => animal.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 8, gap: 8, paddingBottom: 100 }}
      />

      {/* Botão menor e centralizado */}
      <View style={styles.footer}>
        <Link href="/formularioAnimal" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Abrir formulário animal</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: "#606060ff",
    marginHorizontal: 4,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  image: { width: 50, height: 50, borderRadius: 5 },
  name: { color: "#000", fontWeight: "600" },
  age: { color: "#000" },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  primaryButton: {
    backgroundColor: "#0a84ff",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});