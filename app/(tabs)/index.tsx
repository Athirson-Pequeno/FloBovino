import { Image } from 'expo-image';
import { StyleSheet, View, Text, FlatList, ScrollView } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';


export default function HomeScreen() {

  type Animal = {
    id: string;
    nome: string;
    idade: string;
  };

  const data: Animal[] = [
        { id: '1', nome: 'Raposinha', idade: '3 anos' },
        { id: '2', nome: 'Trezeana', idade: '5 anos' },
        { id: '3', nome: 'Lua nova', idade: '2 anos' },
      ];


  const renderItem = ({ item } : { item : Animal }) => (
        <View style={{ padding: 10, flex: 1, flexDirection: 'row', alignItems: 'center', gap:6, borderWidth:2, borderColor:'#606060ff', margin:2, borderRadius: 5 , justifyContent: 'space-between'}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap:6}}>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Cow_female_black_white.jpg' }}
              style={{ width: 50, height: 50, borderRadius: 5 }}
              contentFit="cover" 
            />
            <Text style={{color : '#000000ff'}}>{item.nome}</Text>
            <Text style={{color : '#000000ff'}}>{item.idade}</Text>
          </View>
          <View>
            <IconSymbol size={28} name="calendar" color={'#fff'} />
          </View>
        </View>
      );

  return (
    <ScrollView style={{backgroundColor: '#fff', padding: 5}}>
      <FlatList<Animal>
        data={data}
        keyExtractor={(animal) => animal.id}
        renderItem={renderItem}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
