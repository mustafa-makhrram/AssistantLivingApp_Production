import { View, Text, SafeAreaView,FlatList } from 'react-native'
import React from 'react'
import { useTheme } from '../../../../Theme'
import createStyles from './styles'
import Header from '../../../Components/Header/Header'
import RenderUltrasonic from './RenderUltrasonic'
const Ultrasonic = ({navigation,route}) => {
    const {Data} = route.params
    console.log(Data)
    const {
      Tcolor,
      primary,
      secondary,
      AppName,
      background,
      theme,
      logo,
      toggleTheme,
      gradientbg,
    } = useTheme();
    const styles = createStyles({
      primary,
      secondary,
      background,
      theme,
      logo,
      toggleTheme,
      Tcolor,
      gradientbg,
    });
    const sortedMovements = [...Data]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);
  return (
    <SafeAreaView style={styles.container}>
         <Header navigation={navigation} Heading={'Movements'} back={true} />
      
          <View style={{}}>
      <FlatList
        data={sortedMovements}
        renderItem={({item})=>(
          <RenderUltrasonic item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{padding:10}}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: 10,
        }}
        ListEmptyComponent={
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontSize:20,color:Tcolor}}>No Movements Found</Text>
            </View>
        }
        ListFooterComponent={
          <View style={{height:100}}></View>
        }
      />
      
            </View>
          </SafeAreaView>
  )
}

export default Ultrasonic