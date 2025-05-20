import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React from 'react'
import { useTheme } from '../../../../Theme';
import createStyles from './styles'
import Header from '../../../Components/Header/Header';
import RenderActivities from './RenderActivities';
const RecentActivity = ({navigation,route}) => {
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

        const sortedacts = [...Data]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
  return (
  <SafeAreaView style={styles.container}>
       <Header navigation={navigation} Heading={'Recent Activities'} back={true} />
    
        <View style={{}}>
    <FlatList
      data={sortedacts}
      renderItem={({item})=>(
        <RenderActivities item={item} navigation={navigation} />
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

export default RecentActivity