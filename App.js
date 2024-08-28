import 'react-native-gesture-handler';
import { Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import store from './context/store';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import CreateAccountScreen from './Apps/screens/CreateAccountScreen'
import StarterScreen from './Apps/screens/StarterScreen';
import HomeScreene from './Apps/screens/HomeScreen';
import EventHostRegisterDetailsScreen from './Apps/screens/EventHostRegisterDetailsScreen';
import BookerRegisterDetails from './Apps/screens/BookerRegisterDetailsScreen';
import EventPlannerRegisterDetailsScreen from './Apps/screens/EventPlannerRegisterDetailsScreen';
import LoginScreen from './Apps/screens/LoginScreen';
import AccountTypeScreen from './Apps/screens/AccountTypeScreen';
import ProfileScreen from './Apps/screens/ProfileScreen';
import FavoritesScreen from './Apps/screens/Favorites';
import EventPlannerScreen from './Apps/screens/EventPlannerScreen';
import CategoriesScreen from './Apps/screens/CategoriesScreen';
import EventHostSectionScreen from './Apps/screens/EventHostSectionScreen';
import SettingsScreen from './Apps/screens/SettingsScreen';
import EventHostHistoryScreen from './Apps/screens/EventHostHistoryScreen';
import EventPlannerHistoryScreen from './Apps/screens/EventPlannerHistoryScreen';
import RedirectScreen from './Apps/screens/RedirectScreen';
import EventHostDashboardScreen from './Apps/screens/EventHostDashboardScreen';
import EventPlannerDashboardScreen from './Apps/screens/EventPlannerDashboardScreen';
import ReviewsScreen from './Apps/screens/ReviewsScreen';
import EventHostProfileScreen from './Apps/screens/EventHostProfileScreen';
import EventPlannerSectionScreen from './Apps/screens/EventPlannerSectionScreen';


const TabStack = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name='HomeTab' component={HomeScreene}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>Home</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} style={{ marginTop: 5 }} />)
        }}
      />
      <Tab.Screen name='EventPlanner' component={EventPlannerScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>Event Planners</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="business-center" size={22} color={color} style={{ marginTop: 5 }} />)
        }}
      />
      <Tab.Screen name='Favorites' component={FavoritesScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>Favorites</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="heart" size={20} color={color} style={{ marginTop: 5 }} />)
        }}
      />
      <Tab.Screen name='Settings' component={SettingsScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>Settings</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={20} color={color} style={{ marginTop: 5 }} />)
        }}
      />
    </Tab.Navigator>
  );
}

const HostTabStack = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name='EventHostDashboard' component={EventHostDashboardScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>Home</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} style={{ marginTop: 5 }} />)
        }}
      />
      <Tab.Screen name='EventHostProfile' component={EventHostProfileScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>Profile</Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={22} color={color} style={{ marginTop: 5 }} />)
        }}
      />
    </Tab.Navigator>
  );
}

const SignedInStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Redirect' component={RedirectScreen} />
      <Stack.Screen name='AccountType' component={AccountTypeScreen} />
      <Stack.Screen name='Home' component={TabStack} />
      <Stack.Screen name='HostHome' component={HostTabStack} />
      <Stack.Screen name='EventPlannerDashboard' component={EventPlannerDashboardScreen} />
      <Stack.Screen name='EventHostRegisterDetails' component={EventHostRegisterDetailsScreen} />
      <Stack.Screen name='Categories' component={CategoriesScreen} />
      <Stack.Screen name='EventHostSection' component={EventHostSectionScreen} />
      <Stack.Screen name='EventPlannerSection' component={EventPlannerSectionScreen} />
      <Stack.Screen name='Profile' component={ProfileScreen} />
      <Stack.Screen name='EventHostHistory' component={EventHostHistoryScreen} />
      <Stack.Screen name='EventPlannerHistory' component={EventPlannerHistoryScreen} />
      <Stack.Screen name='Reviews' component={ReviewsScreen} />
    </Stack.Navigator>
  );
}

const SignedOutStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Starter' component={StarterScreen} />
      <Stack.Screen name='CreateAccount' component={CreateAccountScreen} />
      <Stack.Screen name='BookerRegister' component={BookerRegisterDetails} />
      <Stack.Screen name='EventPlannerRegisterDetails' component={EventPlannerRegisterDetailsScreen} />
      <Stack.Screen name='Login' component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <NavigationContainer>
        <Provider store={store}>
          <SignedIn>
            <SignedInStack />
          </SignedIn>
          <SignedOut>
            <SignedOutStack />
          </SignedOut>
        </Provider>
      </NavigationContainer>
    </ClerkProvider>
  );
}


