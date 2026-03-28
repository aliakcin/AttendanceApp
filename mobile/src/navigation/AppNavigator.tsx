import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types';

import LoginScreen from '../screens/LoginScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import ManageClasses from '../screens/admin/ManageClasses';
import ClassDetail from '../screens/admin/ClassDetail';
import ManageStudents from '../screens/admin/ManageStudents';
import ManageTeachers from '../screens/admin/ManageTeachers';
import MyClasses from '../screens/teacher/MyClasses';
import MarkAttendance from '../screens/teacher/MarkAttendance';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        headerShown: false,
      }}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboard} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Classes" component={ManageClasses} />
      <Tab.Screen name="Students" component={ManageStudents} />
      <Tab.Screen name="Teachers" component={ManageTeachers} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTintColor: colors.primary }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : user.role === 'admin' ? (
          <>
            <Stack.Screen
              name="AdminTabs"
              component={AdminTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ClassDetail"
              component={ClassDetail}
              options={({ route }) => ({ title: (route.params as any)?.className || 'Class' })}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="TeacherHome"
              component={MyClasses}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MarkAttendance"
              component={MarkAttendance}
              options={({ route }) => ({ title: 'Mark Attendance' })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
