import { View, Text, SafeAreaView, FlatList, ActivityIndicator,RefreshControl,ScrollView } from 'react-native'
import React, { useState,useEffect } from 'react'
import { useTheme } from '../../../../Theme'
import createStyles from './styles'
import Header from '../../../Components/Header/Header'
import SearchPeople from '../../../Components/SearchPeople/SearchPeople'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RenderNotifications from './RenderNotifications'
import { s } from 'react-native-size-matters'
const Notifications = ({navigation}) => {
  const [UsersData, setUsersData] = useState([])
   const { Tcolor, primary, secondary, background, theme, logo, toggleTheme } =
     useTheme();
   const styles = createStyles({
     Tcolor,
     primary,
     secondary,
     background,
     theme,
     logo,
     toggleTheme,
   });
   const [Filter, setFilter] = useState(false);
   const [search, setSearch] = useState('');
   const [users, setUsers] = useState([]);
   const [filteredUsers, setFilteredUsers] = useState([]);
   console.log('filtered', filteredUsers);
   const [page, setPage] = useState(1);
   const [loading, setLoading] = useState(false);
   const [allUsers, setAllUsers] = useState([]);
   const [refreshing, setRefreshing] = useState(false);
   const [HighPriority, setHighPriority] = useState([]);
    const [LowPriority, setLowPriority] = useState([]);

     // Fetch users on component mount and pagination
const fetchUsers = async () => {
  setLoading(true);

  try {
    const myNotifications = await AsyncStorage.getItem('notification');

    if (!myNotifications) {
      console.log('No notifications found in AsyncStorage.');
      setLoading(false);
      return;
    }

    const parsedNotifications = JSON.parse(myNotifications);

    if (!Array.isArray(parsedNotifications)) {
      console.warn('Parsed data is not an array.');
      setLoading(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Midnight today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Midnight tomorrow

    const todayNotifications = parsedNotifications.filter((notif) => {
      const timestamp = notif?.request?.content?.data?.Timestamp;
      if (!timestamp) return false;

      const notifDate = new Date(timestamp); // Supports both numeric & string
      return notifDate >= today && notifDate < tomorrow;
    });

    // Sort in descending order (latest first)
    todayNotifications.sort((a, b) => {
      const aTime = new Date(a?.request?.content?.data?.Timestamp).getTime();
      const bTime = new Date(b?.request?.content?.data?.Timestamp).getTime();
      return bTime - aTime;
    });
const highPriority = todayNotifications.filter((notif) => notif?.request?.content?.data?.priority === 'high');
setHighPriority(highPriority);
const lowPriority = todayNotifications.filter((notif) => notif?.request?.content?.data?.priority !== 'high');
setLowPriority(lowPriority);
    setUsers(todayNotifications);
    setFilteredUsers(todayNotifications);
  } catch (error) {
    console.error('Failed to fetch or parse notifications:', error);
  } finally {
    setLoading(false);
  }
};




  useEffect(() => {
    fetchUsers();
  }, [page]);

  // Handle search
  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = users?.filter((user) =>
        user?.Name?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  // Load more users (pagination)
  const loadMore = () => {
    if (!loading && page * 10 < allUsers.length) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Refresh users when pulling down
  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing to true when pull-to-refresh is triggered
    setPage(1); // Reset page to 1 for a fresh load of data
    await fetchUsers(); // Fetch users again
    setRefreshing(false); // Set refreshing to false when fetch is complete
  };

  useEffect(() => {
    handleSearch(search);
  }, [search]);

  return (
    <SafeAreaView style={styles.container}>

      <Header Heading={'Notifications'} navigation={navigation}/>
      <ScrollView showsVerticalScrollIndicator={false} style={{flex:1}}>
{
  HighPriority.length === 0 && LowPriority.length === 0 && (
  <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
  <Text style={{fontSize:s(20),color:primary,textAlign:'center',fontFamily:'PoppinsR'}}>No Notifications Found</Text>
  </View>
  )
}
{
  HighPriority.length > 0 && (
  <Text style={styles.section1}>
  High Priority Notifications ({HighPriority.length})
</Text>
  )
}

{
  HighPriority.length > 0 && (
      <FlatList
        data={HighPriority}
        // keyExtractor={(item) => item.id.toString()}
       renderItem={({ item }) => (
  <RenderNotifications item={item?.request?.content?.data} navigation={navigation} />
)}

        contentContainerStyle={styles.listContainer}
        onEndReached={loadMore}
        showVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} // Triggered when pull-to-refresh happens
            colors={['#4CAF50']} // Customize the pull-to-refresh loader color
            tintColor="#4CAF50"
          />
        }
        ListFooterComponent={loading && <ActivityIndicator size="large" color="#4CAF50" />}
      />
  )
}
    

{
  LowPriority.length > 0 && (
  <Text style={styles.section1}>
  Medium Priority Notifications({LowPriority.length})
</Text>
  )
}


 <FlatList
        data={LowPriority}
        // keyExtractor={(item) => item.id.toString()}
       renderItem={({ item }) => (
  <RenderNotifications item={item?.request?.content?.data} navigation={navigation} />
)}

        contentContainerStyle={styles.listContainer}
        onEndReached={loadMore}
        showVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} // Triggered when pull-to-refresh happens
            colors={['#4CAF50']} // Customize the pull-to-refresh loader color
            tintColor="#4CAF50"
          />
        }
        ListFooterComponent={loading && <ActivityIndicator size="large" color="#4CAF50" />}
      />
</ScrollView>

    </SafeAreaView>
  )
}

export default Notifications