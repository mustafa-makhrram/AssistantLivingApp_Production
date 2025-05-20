import { View, Text, SafeAreaView, FlatList, ActivityIndicator,RefreshControl,ScrollView } from 'react-native'
import React, { useState,useEffect } from 'react'
import { useTheme } from '../../../../Theme'
import createStyles from './styles'
import Header from '../../../Components/Header/Header'
import SearchPeople from '../../../Components/SearchPeople/SearchPeople'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RenderLatency from './RenderLatency'
const Latency = ({navigation}) => {
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
    const myNotifications = await AsyncStorage.getItem('notification_log');

    if (!myNotifications) {
      console.log('No notifications found in AsyncStorage.');
      setLoading(false);
      return;
    }

    console.log('first 2',myNotifications);
    const parsedNotifications = JSON.parse(myNotifications);

    if (!Array.isArray(parsedNotifications)) {
      console.warn('Parsed data is not an array.');
      setLoading(false);
      return;
    }
console.log('the parsed are',parsedNotifications);
  const dataofnot = parsedNotifications
    setUsers(dataofnot);
    setFilteredUsers(dataofnot);
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


<Text style={styles.section1}>
        {users.length} Medium Priority Notifications
    </Text>
  <Text style={styles.section2}>
  Not Responsive Notifications --> {
    users?.filter(user => user.latency !== null && user.latency !== undefined).length
  } 
</Text>

  <Text style={{...styles.section2,color:'green'}}>
 Succeeded Notifications --> {
    users?.filter(user => user.latency == null && user.latency !== undefined).length
  } 
</Text>


      <FlatList
        data={users}
        // keyExtractor={(item) => item.id.toString()}
       renderItem={({ item }) => (
  <RenderLatency item={item} navigation={navigation} />
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

export default Latency