import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function MainPage() {
  const navigation = useNavigation(); //for navigating between pages
  const [items, setItems] = useState([]); // the products list
  const [Query, setQuery] = useState(""); //for the search bar
  const [selectedCategory, setSelectedCategory] = useState(""); //for the category filter

  //code that runs when loading the page
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken'); //gets the login tokem form local storage
        if (token) {
          navigation.navigate('MainAdmin'); //navigate to the admin page if it exists
        } else {
          apiCall(); //calls this function
        }        
      } catch (error) {
        console.error('error message:', error)
      }

    };
  
    checkToken();
  }, []);

  //Calls the API to get all the products
  const apiCall = async () => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      setItems(response.data);// places the products i nthe items variable
      //use this to check the products list
      // console.log(response.data)
      console.log("Fetched items:", response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  //code for handling filtration, both search bar and category
  const filterItems = useMemo(() => { //useMemo so that the API is not called upon multiple times
    return items.filter((item) => {
      const matchesQuery = item.title.toLowerCase().includes(Query.toLowerCase()); //converts the input to lowercase
      const matchesCategory = selectedCategory ? item.category.toLowerCase() === selectedCategory.toLowerCase() : true;
      return matchesQuery && matchesCategory;
    });
  }, [items, Query, selectedCategory]);

  //navigate to the product's details page.
  const desc = (productId) => {
    navigation.navigate('ProductDetails', { id: productId }); // You need to set up this screen
  };

  //Creates an array that holds the categories
  const uniqueCategories = [...new Set(items.map(item => item.category))];

  return (
    <ScrollView style={styles.container}>
      {/* nav bar */}
      <View style={styles.navbar}>
        <TouchableOpacity >
          <Image source={require('../assets/Weasydoo.png')} style={styles.logo} />
        </TouchableOpacity>
        <TouchableOpacity  style={styles.loginButton}>
          <Text style={styles.loginText} onPress={() => navigation.navigate('login')}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>This is the front page, you can search for items here.</Text>
      </View>

      <View style={styles.searchBarContainer}>
        {/* search bar */}
        <TextInput
          value={Query}
          onChangeText={setQuery}
          placeholder="Search for the product here"
          style={styles.searchBar}
        />
      </View>
      {/* categories */}
      <ScrollView horizontal contentContainerStyle={styles.categoryList}>
        {uniqueCategories.map((category, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory
            ]}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
        {selectedCategory !== "" && (
          <TouchableOpacity onPress={() => setSelectedCategory("")} style={styles.clearButton}>
            <Text style={styles.categoryText}>Clear Filter</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
        {/* displayed products */}
      <View style={styles.itemsContainer}>
        {items.length > 0 ? (
          filterItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <TouchableOpacity onPress={() => desc(item.id)}>
                <Text style={styles.itemTitle}>{item.title}</Text>
              </TouchableOpacity>
              <Text style={styles.price}>${item.price}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>
          ))
        ) : (
          <Text>Loading products...</Text>
        )}
      </View>
    </ScrollView>
  );
};

//CSS used
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E5E7EB' },
  navbar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', backgroundColor: '#93C5FD', padding: 10
  },
  logo: { width: 100, height: 40, resizeMode: 'contain' },
  loginButton: {
    borderWidth: 2, borderColor: '#fff', padding: 10,
    borderRadius: 999, marginRight: 10, backgroundColor: '#fff'
  },
  loginText: { fontWeight: 'bold', color: '#3B82F6' },
  welcomeSection: {
    height: 200, backgroundColor: '#bae6fd',
    justifyContent: 'center', alignItems: 'center'
  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#0E7490' },
  subtitle: { fontSize: 16, color: '#0E7490', textAlign: 'center' },
  searchBarContainer: { alignItems: 'center', marginTop: 20 },
  searchBar: {
    backgroundColor: '#D1D5DB', width: 250,
    padding: 12, borderRadius: 16, textAlign: 'center'
  },
  categoryList: {
    flexDirection: 'row', padding: 10, alignItems: 'center'
  },
  categoryButton: {
    backgroundColor: '#60A5FA', padding: 10,
    marginHorizontal: 5, borderRadius: 10
  },
  selectedCategory: {
    backgroundColor: '#2563EB'
  },
  clearButton: {
    backgroundColor: '#F87171', padding: 10,
    marginHorizontal: 5, borderRadius: 10
  },
  categoryText: { color: '#fff', fontWeight: 'bold' },
  itemsContainer: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', gap: 10, padding: 10
  },
  card: {
    backgroundColor: '#FEF08A', padding: 10,
    margin: 10, width: 160, alignItems: 'center',
    borderRadius: 10, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2
  },
  itemImage: { width: 100, height: 100, resizeMode: 'contain' },
  itemTitle: { fontWeight: 'bold', fontSize: 14, marginTop: 5 },
  price: { color: '#047857', fontWeight: 'bold' },
  category: { fontWeight: 'bold' }
});

export default MainPage;
