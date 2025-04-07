import MainPage from './pages/MainPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './pages/login';
import ProductScreen from './productPages/products/[id]/page';
import MainPageAdmin from './pages/MainPageAdmin';
import ProductPage from './productPages/productsAdmin/[id]/page';


export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Main' >
        <Stack.Screen name="Main" component={MainPage}/>
        <Stack.Screen name="login" component={Login}/>
        <Stack.Screen name="MainAdmin" component={MainPageAdmin}/>
        <Stack.Screen name="ProductDetails" component={ProductScreen}/>
        <Stack.Screen name="ProductAdmin" component={ProductPage}/>    
      </Stack.Navigator>
    </NavigationContainer>
// add options={{ headerShown: false }} to the stacks if you want to remove the header.
  );
}