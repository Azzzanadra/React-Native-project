import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { FaFacebookF, FaLinkedin, FaGoogle, FaRegEnvelope } from 'react-icons/fa';
import { MdLockOutline } from 'react-icons/md';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const navigation = useNavigation(); //for navigating between pages
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  }); //variable that stores username and password
  const [error, setError] = useState(""); //error catching variable

  //function for handling the input from username and password inputs
  const handleChange = (name, value) => {
    setCredentials({ ...credentials, [name]: value });
  };

  //function that logs the user in
  const handleLogin = async () => {
    try {
      setError('');
      const response = await axios.post('https://fakestoreapi.com/auth/login', credentials, {
        headers: { 'Content-Type': 'application/json' }
      });

      const token = response.data.token; //takes the login token from the response

      if (token) {
        await AsyncStorage.setItem("authToken", token); //add the token to the local storage
        navigation.navigate("MainAdmin"); //navigate to the admin page
      }
    } catch (error) {
      setError('Username or Password incorrect');
    }
  };

  //code that runs when the page loads
  useEffect(() => {
    //gets the list of users ex. username: johnd, password:m38rmF$
    // axios.get('https://fakestoreapi.com/users')
    // .then(response => console.log(response.data))
    AsyncStorage.getItem("authToken").then(token => {
      if (token) navigation.navigate("MainAdmin"); //prevents the user from accessing this page if they're already logged in.
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* logo */}
      <TouchableOpacity  onPress={() => navigation.navigate('Main')}>
        <Image style={styles.logo} source={require('../assets/Weasydoo.png')}/>
      </TouchableOpacity>
      <Text style={styles.header}>Sign-in Account</Text>

      {/* social links */}
      <View style={styles.socialIcons}>
        <TouchableOpacity style={styles.icon}><FaFacebookF /></TouchableOpacity>
        <TouchableOpacity style={styles.icon}><FaLinkedin /></TouchableOpacity>
        <TouchableOpacity style={styles.icon}><FaGoogle /></TouchableOpacity>
      </View>

      <Text style={styles.subText}>Or use your email and password</Text>

      {/* input HTML for username and password */}
      <View style={styles.inputContainer}>
        <View style={styles.inputBox}>
          <FaRegEnvelope style={styles.iconInline} />
          <TextInput placeholder="User name" style={styles.input} onChangeText={text => handleChange('username', text)}/>
        </View>

        <View style={styles.inputBox}>
          <MdLockOutline style={styles.iconInline} />
          <TextInput placeholder="Password" secureTextEntry style={styles.input} onChangeText={text => handleChange('password', text)}/>
        </View>

        <View style={styles.rowBetween}>
          <Text>Remember me</Text>
          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        {/* if username or password is wrong */}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        {/* login button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

//CSS used
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    cursor: "pointer",
  },
  header: {
    fontSize: 20,
    color: '#60a5fa',
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  icon: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#e5e7eb',
    borderRadius: 50,
  },
  subText: {
    color: '#6b7280',
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 300,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#bcbcbc',
    padding: 10,
  },
  iconInline: {
    color: '#9ca3af',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  forgot: {
    color: '#60a5fa',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#60a5fa',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
