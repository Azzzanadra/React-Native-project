import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

function ProductScreen({ route, navigation }) {
  const { id } = route.params || {}; //gets the id from the url
  const [product, setProduct] = useState(null); //holds the product's information

  //code that runs when the page is called
  useEffect(() => {
    if (id) {
      fetchProduct(); //get this function if there is an id
    }
  }, [id]);

  //function that fetches product information
  const fetchProduct = async () => {
    try {
      const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
      setProduct(response.data); //puts the product's properties in the product variable.
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  //loading screen until the product data is retrieved
  if (!product) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading product details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* nav bar */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => navigation.navigate('MainPageAdmin')}>
          <Image source='#' style={styles.logo} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('login')}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* product details */}
      <View style={styles.content}>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <View style={styles.details}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Text style={styles.price}>Price: ${product.price}</Text>
          <Text style={styles.category}>Category: {product.category}</Text>
          <Text style={styles.rating}>Rating: 3/5</Text>
          <Text style={styles.review}>
            Review: Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit earum quam eum...
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

//CSS used
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcd34d', // amber-300
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#93c5fd', // blue-300
    alignItems: 'center',
    padding: 10,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  loginButton: {
    borderWidth: 2,
    borderColor: 'white',
    padding: 10,
    borderRadius: 30,
    marginRight: 10,
    backgroundColor: 'white',
  },
  loginText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6', // blue-500
  },
  content: {
    flexDirection: 'column',
    padding: 20,
    alignItems: 'center',
  },
  productImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  details: {
    flex: 1,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginTop: 10,
  },
  price: {
    fontSize: 20,
    color: 'green',
    marginTop: 10,
  },
  category: {
    fontSize: 20,
    color: '#2563eb',
    marginTop: 5,
  },
  rating: {
    fontSize: 20,
    color: '#7f6000',
    marginTop: 5,
  },
  review: {
    marginTop: 15,
    fontSize: 14,
  },
});

export default ProductScreen;