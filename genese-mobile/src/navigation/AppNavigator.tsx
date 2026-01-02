import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

import WelcomeScreen from "../screens/WelcomeScreen";
import RoleSelectorScreen from "../screens/RoleSelectorScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ProfileSetupScreen from "../screens/ProfileSetupScreen";
import TutorialScreen from "../screens/TutorialScreen";
import AssessmentScreen from "../screens/AssessmentScreen";
import ResultsScreen from "../screens/ResultsScreen";
import ProgramScreen from "../screens/ProgramScreen";
import SessionScreen from "../screens/SessionScreen";
import FeedbackScreen from "../screens/FeedbackScreen";
import DashboardScreen from "../screens/DashboardScreen";

export type RootStackParamList = {
  Welcome: undefined;
  RoleSelector: undefined;
  Login: { role: "USER" | "STAFF" } | undefined;
  SignUp: undefined;
  ProfileSetup: undefined;
  Tutorial: undefined;
  Assessment: undefined;
  Results: undefined;
  Program: undefined;
  Session: { seanceId?: string } | undefined;
  Feedback: { seanceId: string } ;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { accessToken, ready } = useAuth();

  if (!ready) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!accessToken ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="RoleSelector" component={RoleSelectorScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            <Stack.Screen name="Tutorial" component={TutorialScreen} />
            <Stack.Screen name="Assessment" component={AssessmentScreen} />
            <Stack.Screen name="Results" component={ResultsScreen} />
            <Stack.Screen name="Program" component={ProgramScreen} />
            <Stack.Screen name="Session" component={SessionScreen} />
            <Stack.Screen name="Feedback" component={FeedbackScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
