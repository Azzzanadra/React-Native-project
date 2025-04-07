import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image, TouchableOpacity, StyleSheet,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainPageAdmin = () => {
  const navigation = useNavigation(); //for navigating between pages
  const [items, setItems] = useState([]); // the products list
  const [add, setAdd] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
  }); //the variable for adding a new product
  const [query, setQuery] = useState(''); //for the search bar
  const [selectedCategory, setSelectedCategory] = useState(''); //for the category filter
  const [loading, setLoading] = useState(true); //for loading before the products list is loaded

  //Calls the API to get all the products
  const apiCall = async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      setItems(response.data); // places the products i nthe items variable
      //use this to check the products list
      // console.log(response.data)
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false); //set loading to false
    }
  };

  //handles the code for logging out from the admin page
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken"); //removes the login token from local storage
      //use this to check if the token was removed
      // console.log("Logged out successfully");
      navigation.navigate('Main'); //go to the main page
    } catch (error) {
      console.error("Logout failed:", error)
    }
  };
  
  //function for handling inputs.
  const handleChange = (name, value) => {
    setAdd(prev => ({ ...prev, [name]: value }));
  };

  //the function that adds a new product
  const handleAdd = async () => {
    try {
        const response = await axios.post('https://fakestoreapi.com/products', add);
        
        setItems(prev => [...prev, response.data]); //modifies items to add this new item
        
        setAdd({ title: '', price: 0.0, description: '', category: '', image: '' }); //return the add variable to default values
    } catch (error) {
        console.error("Error adding product:", error);
    }
};

  //function that handles deleting a product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://fakestoreapi.com/products/${id}`);
      setItems(prev => prev.filter(item => item.id !== id)); //gets the id of the item then remove it from the items variable.
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  //code for handling filtration, both search bar and category
  const filterItems = useMemo(() => { //useMemo so that the API is not called upon multiple times
    return items.filter(item => {
      const matchesQuery = item.title?.toLowerCase().includes(query.toLowerCase()); //converts the input to lowercase
      const matchesCategory = selectedCategory
        ? item.category?.toLowerCase() === selectedCategory.toLowerCase()
        : true;
      return matchesQuery && matchesCategory;
    });
  }, [items, query, selectedCategory]);

  //navigate to the product's details page.
  const desc = (productId) => {
    navigation.navigate('ProductAdmin', { id: productId });
  };

  //code that activates when loading the page
  useEffect(() => {
    // Simulate token check
    const checkout = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken'); //finds the authToken in local storage
        if (!token) {
          navigation.navigate('Main'); //navigate to the main page if the login token doesn't exist
        } else {
          apiCall(); //otherwise call this function
        }              
      } catch (error) {
        console.error('error message:', error)
      }

    }
    checkout()
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* nav bar */}
      <View style={styles.navbar}>
        <TouchableOpacity >
          <Image source={require('../assets/Weasydoo.png')} style={styles.logo} />
        </TouchableOpacity>
        <TouchableOpacity  style={styles.loginButton}>
          <Text style={styles.loginText} onPress={handleLogout}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.header}>Admin Page</Text>
      {/* Search bar */}
      <TextInput value={query} onChangeText={setQuery} placeholder="Search for a product..." style={styles.input}
      />

      {/* Add Product Form */}
      <View style={styles.form}>
        <TextInput placeholder="Title" value={add.title} onChangeText={text => handleChange('title', text)} style={styles.input}/>
        <TextInput placeholder="Price" value={add.price} onChangeText={text => handleChange('price', text)} keyboardType="numeric" style={styles.input}/>
        <TextInput placeholder="Description" value={add.description} onChangeText={text => handleChange('description', text)} style={styles.input}/>
        <TextInput placeholder="Category" value={add.category} onChangeText={text => handleChange('category', text)} style={styles.input}/>
        <TextInput placeholder="Image URL" value={add.image} onChangeText={text => handleChange('image', text)} style={styles.input}/>
        <Button title="Add Product" onPress={handleAdd} style={styles.button}/>
      </View>
      {/* Category Filters */}
      <ScrollView horizontal style={styles.categoryRow}>
        {[...new Set(items.map(item => item.category))].map((category, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedCategory(category)} style={[ styles.categoryBtn, selectedCategory === category && styles.activeCategory,]}>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
        {selectedCategory !== '' && (
          <TouchableOpacity onPress={() => setSelectedCategory('')} style={styles.clearBtn}>
            <Text style={styles.categoryText}>Clear</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Product List */}
      <View style={styles.grid}>
        {loading ? (
          <Text>Loading products...</Text>
        ) : (
          filterItems.map(item => (
            <View key={item.id} style={styles.card}>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                <Text style={{ color: 'white' }}>X</Text>
              </TouchableOpacity>
              <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
              <TouchableOpacity onPress={() => desc(item.id)}>
                <Text style={styles.title}>{item.title}</Text>
              </TouchableOpacity>
              <Text style={styles.price}>${item.price}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

//List of CSS used
const styles = StyleSheet.create({
  container: {

    backgroundColor: '#f1faee',
    alignItems: 'center',
  },
  navbar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', backgroundColor: '#93C5FD', padding: 10,
    width: '100%'
  },
  logo: { width: 100, height: 40, resizeMode: 'contain' },
  loginText: { fontWeight: 'bold', color: '#3B82F6' },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1d3557',
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: 250,
  },
  form: {
    marginVertical: 20,
    alignItems: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  categoryBtn: {
    padding: 10,
    marginRight: 5,
    backgroundColor: '#a8dadc',
    borderRadius: 8,
  },
  button:{
    color: "#457b9d",
    padding: 5,
    borderRadius: 12,
  },
  activeCategory: {
    backgroundColor: '#1d3557',
  },
  clearBtn: {
    padding: 10,
    backgroundColor: '#e63946',
    borderRadius: 8,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffeb99',
    padding: 10,
    margin: 8,
    width: 160,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center',
  },
  price: {
    color: '#2a9d8f',
    fontWeight: 'bold',
  },
  category: {
    fontSize: 12,
    color: '#555',
  },
  deleteBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 15,
    padding: 5,
  },
});

export default MainPageAdmin;
