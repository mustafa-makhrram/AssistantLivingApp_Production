import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useTheme } from "../../../../Theme";
import createStyles from "./styles";
import Header from "../../../Components/Header/Header";
import SearchPeople from "../../../Components/SearchPeople/SearchPeople";
import RenderUser from "./RenderUser";
import fetchAllUsers from "../../../utils/FetchAllUsers/FetchAllUsers";
const Users = ({ navigation }) => {
  const [UsersData, setUsersData] = useState([]);
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
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  // Fetch users on component mount and pagination
  const fetchUsers = async () => {
    setLoading(true);

    const myusers = await fetchAllUsers();
    console.log("my users", myusers.Name);
    const relatedusers = myusers.filter(
      (user) => user?.Email !== "caregiver@admin.com"
    );
    console.log("the related users", relatedusers);
    setAllUsers(relatedusers);
    const newUsers = relatedusers.slice((page - 1) * 10, page * 10);

    // Avoid duplicates by checking if users already exist
    const uniqueUsers = relatedusers.filter(
      (newUser) => !users.some((user) => user.id === newUser.id)
    );

    setTimeout(() => {
      setUsers((prevUsers) => [...prevUsers, ...uniqueUsers]);
      setFilteredUsers((prevFilteredUsers) => [
        ...prevFilteredUsers,
        ...uniqueUsers,
      ]);
      setLoading(false);
    }, 1000); // Simulate API delay
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
      <Header Heading={"Users"} noback={true} />
      <SearchPeople
        search={search}
        setSearch={setSearch}
        Filter={Filter}
        setFilter={setFilter}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RenderUser item={item} navigation={navigation} />
        )}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMore}
        showVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} // Triggered when pull-to-refresh happens
            colors={["#4CAF50"]} // Customize the pull-to-refresh loader color
            tintColor="#4CAF50"
          />
        }
        ListFooterComponent={
          loading && <ActivityIndicator size="large" color="#4CAF50" />
        }
      />
    </SafeAreaView>
  );
};

export default Users;
