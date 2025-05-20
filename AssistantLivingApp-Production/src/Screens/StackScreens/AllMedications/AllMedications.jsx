import { View, Text, SafeAreaView, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../Theme';
import createStyles from './styles';
import fetchFutureMedicines from '../../../utils/FetchFutureMedications/FetchFutureMedications';
import Header from '../../../Components/Header/Header';
import SearchPeople from '../../../Components/SearchPeople/SearchPeople';
import RenderMedications from './RenderMedications';

const AllMedications = ({ navigation, route }) => {
  const {
    Tcolor,
    primary,
    secondary,
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

  const [medicines, setMedicines] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  console.log('the filtered', filteredUsers);
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { RaspberrryPiID } = route.params;

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = medicines?.filter((user) =>
        user?.medication_name?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(medicines);
    }
  };

  const fetchMeds = async () => {
    setLoading(true);
    try {
      const meds = await fetchFutureMedicines(RaspberrryPiID);
      setAllUsers(meds);
      setMedicines(meds);
      setFilteredUsers(meds);
    } catch (error) {
      console.error('Failed to fetch medications:', error.message);
    }
    setLoading(false);
  };

  const loadMore = () => {
    if (!loading && page * 10 < allUsers.length) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchMeds();
    setRefreshing(false);
  };

  useEffect(() => {
    handleSearch(search);
  }, [search]);

  useEffect(() => {
    fetchMeds();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header Heading="All Medications" navigation={navigation} />
      <SearchPeople
        search={search}
        setSearch={setSearch}
        Filter={filter}
        setFilter={setFilter}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RenderMedications item={item} navigation={navigation} RaspberrryPiID={RaspberrryPiID[0]} />
        )}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
        ListFooterComponent={loading && <ActivityIndicator size="large" color="#4CAF50" />}
      />
    </SafeAreaView>
  );
};

export default AllMedications;
