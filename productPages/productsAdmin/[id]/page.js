import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  useNavigation, useRoute } from '@react-navigation/native';

const ProductPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id} = route.params || {}; //gets the id from the url

  const [product, setProduct] = useState(null); //holds the product's information
  const [update, setUpdate] = useState({}); //holds the data to update the product's properties
  const [isAuthenticated, setIsAuthenticated] = useState(false); //checks if token exists

  //code that runs when the page is called
  useEffect(() => {
    if (id) {
      fetchProduct(); //get this function if there is an id
    }
    const token = AsyncStorage.getItem('authToken');
    if (!token){
        navigation.navigate('/Main') //if login token doesn't exist, return to the main page
    }else{
        setIsAuthenticated(true);
    }
  }, [id],[]);

  //function that fetches product information
  const fetchProduct = async () => {
    try {
      const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
      setProduct(response.data); //puts the product's properties in the product variable.
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  //function to handle changes in the inputs
  const handleChange = (name, value) => {
    setUpdate(prev => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  //function that handles updating the product's properties
  const handleUpdate = async () => {
    if (!product || Object.keys(update).length === 0) return; //if there is no product or the inputs are empty, do nothing

    try {
      const response = await axios.put(`https://fakestoreapi.com/products/${id}`, {
        ...product,
        ...update,
      });
      setProduct(response.data); //update the product
      setUpdate({}); //set the update variable to empty object
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  //handles logging out
  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken'); //removes the login token from local storage
    navigation.navigate('Main');
  };

  //loading screen until the product data is retrieved
  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Loading product details...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* nav bar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('MainPageAdmin')}>
          <Image source={require('../../../assets/Weasydoo.png')} style={styles.logo} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* updating inputs */}
      <View style={styles.inputContainer}>
        <TextInput placeholder="Update title" onChangeText={text => handleChange('title', text)} style={styles.input} />
        <TextInput placeholder="Update price" onChangeText={text => handleChange('price', text)} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Update description" onChangeText={text => handleChange('description', text)} multiline style={styles.input} />
        <TextInput placeholder="Update image URL" onChangeText={text => handleChange('image', text)} style={styles.input} />
        <TextInput placeholder="Update category" onChangeText={text => handleChange('category', text)} style={styles.input} />
        <Button title="Update Product" onPress={handleUpdate} color="#1e40af" />
      </View>

      {/* product details */}
      <View style={styles.productContainer}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <View style={styles.details}>
          <Text style={styles.title}>{product.title}</Text>
          <Text>{product.description}</Text>
          <Text style={styles.price}>Price: ${product.price}</Text>
          <Text style={styles.category}>Category: {product.category}</Text>
          <Text style={styles.rating}>Rating: 3/5</Text>
          <Text style={styles.review}>Review: Lorem ipsum dolor sit amet consectetur adipisicing elit...</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: '#fcd34d',
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navbar: {
    backgroundColor: '#93c5fd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  logoutButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e40af',
  },
  logoutText: {
    color: '#1e40af',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputContainer: {
    marginTop: 20,
    gap: 12,
  },
  input: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 10,
  },
  productContainer: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  productImage: {
    width: 250,
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  details: {
    marginTop: 16,
    paddingHorizontal: 10,
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    color: 'green',
  },
  category: {
    fontSize: 18,
    color: 'blue',
  },
  rating: {
    fontSize: 18,
    color: '#7f6000',
  },
  review: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default ProductPage;
