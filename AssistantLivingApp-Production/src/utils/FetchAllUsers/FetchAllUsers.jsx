import { collectionGroup, query, orderBy, getDocs, collection } from 'firebase/firestore';
import {  firestore } from '../../../firebaseConfig'; 

/**
 * @returns {Promise<Array>} - Returns an array of posts.
 */
const fetchAllUsers = async () => {
  try {
    const postsRef = collection(firestore, 'Users');

    const postsQuery = query(postsRef, orderBy('createdAt', 'desc'));

    // Fetch the query snapshot
    const querySnapshot = await getDocs(postsQuery);

    // Extract and return post data
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id, // Include document ID
        ...doc.data(), // Include document data
      });
    });

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    throw new Error('Failed to fetch posts.');
  }
};

export default fetchAllUsers;
