import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../Theme";
import createStyles from "./styles";
import RenderPosts from "./RenderPosts";
import fetchPosts from "../../utils/FetchPosts/FetchPosts";
export default function PastPosts({ Data }) {
  console.log('Data of all is ',Data)
  const [PostData, setPostData] = useState([]);
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
  // const PostData = [
  //     {
  //     id: 1,
  //     title: 'Post 1',
  //     description: 'This is the first post from you and it is a very long post that is why it is being cut off from the end of the line and it is a very long post that is why it is being cut off from the end of the line and it is a very long post that is why it is being cut off from the end of the line',
  //     },
  //     {
  //     id: 2,
  //     title: 'Post 2',
  //     description: 'This is the second post',
  //     },
  //     {
  //     id: 3,
  //     title: 'Post 3',
  //     description: 'This is the third post',
  //     },
  //     {
  //     id: 4,
  //     title: 'Post 4',
  //     description: 'This is the fourth post',
  //     },]

  const getPosts = async () => {
    try {
      const posts = await fetchPosts(Data);
      setPostData(posts);
      console.log("Posts in Descending Order:", posts);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);
  return (
    <View>
      <Text style={styles.name}>Recent Posts</Text>
      <View>
        {PostData && PostData?.length > 0 && PostData !== undefined ? (
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={PostData.slice(0, 5)} 
            renderItem={({ item }) => <RenderPosts item={item} />}
            keyExtractor={(item) => item?.id?.toString()}
          />
        ) : (
          <Text
            style={{ ...styles.aboutme, color: "red", textAlign: "center" }}
          >
            No posts yet
          </Text>
        )}
      </View>
    </View>
  );
}
