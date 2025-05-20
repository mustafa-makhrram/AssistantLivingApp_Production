import { View, Text ,SafeAreaView,FlatList} from 'react-native'
import React from 'react'
import { useTheme } from '../../../../Theme';
import createStyles from './styles'
import RenderBeds from './RenderBeds';
import Header from '../../../Components/Header/Header';
const BedScreen = ({navigation,route}) => {
    const {Data,token} = route.params
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

        const sortedBeds = [...Data]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
      
  return (
      <SafeAreaView style={styles.container}>
       <Header navigation={navigation} Heading={'Bed Activity'} back={true} />
    
        <View style={{}}>
    <FlatList
      data={sortedBeds}
      renderItem={({item,index})=>(
        <RenderBeds item={item} token={token} navigation={navigation} index={index}/>
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
          <Text style={{fontSize:20,color:Tcolor}}>No Rooms Found</Text>
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

export default BedScreen