import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
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

function HeaderLogoutButton() {
  const { logout } = useAuth();

  return (
    <Pressable onPress={logout} hitSlop={8}>
      <Text style={{ color: colors.danger, fontSize: 14, fontWeight: '700' }}>Logout</Text>
    </Pressable>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          height: 62,
          paddingTop: 6,
          paddingBottom: 6,
          borderTopColor: colors.border,
          backgroundColor: colors.card,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: true,
        headerStyle: { backgroundColor: colors.card },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: '700',
          color: colors.text,
        },
        headerTitleAlign: 'left',
        headerShadowVisible: false,
        headerRight: () => <HeaderLogoutButton />,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboard}
        options={{ tabBarLabel: 'Home', title: 'Dashboard' }}
      />
      <Tab.Screen name="Classes" component={ManageClasses} options={{ title: 'Classes' }} />
      <Tab.Screen name="Students" component={ManageStudents} options={{ title: 'Students' }} />
      <Tab.Screen name="Teachers" component={ManageTeachers} options={{ title: 'Teachers' }} />
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
      <Stack.Navigator
        screenOptions={{
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.card },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '700',
            color: colors.text,
          },
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
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
              options={({ route }) => ({
                title: (route.params as any)?.className || 'Class',
                headerRight: () => <HeaderLogoutButton />,
              })}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="TeacherHome"
              component={MyClasses}
              options={{
                title: 'My Classes',
                headerRight: () => <HeaderLogoutButton />,
              }}
            />
            <Stack.Screen
              name="MarkAttendance"
              component={MarkAttendance}
              options={({ route }) => ({
                title: (route.params as any)?.className || 'Mark Attendance',
                headerRight: () => <HeaderLogoutButton />,
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
