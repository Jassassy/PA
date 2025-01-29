import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import Login from './apps/screens/Login';
import { useState } from 'react';
import {onAuthStateChanged, User} from 'firebase/auth';
import { FIREBASE_AUTH } from './FireBaseConfig';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Home from './apps/screens/Home';


const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideStackScreen() {
    return (
        <InsideStack.Navigator id={undefined}>
            <InsideStack.Screen name="My Todos" component={Home} />
            <InsideStack.Screen name="Login" component={Login} />
        </InsideStack.Navigator>
    );
}
export default function App() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user) => {
            console.log('user', user);
            setUser(user);
        });
    });
    
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator id={undefined} initialRouteName='Login'>
                    {user ? (
                        <Stack.Screen name='Home' component={InsideStackScreen} options={{headerShown: false}} />
                    ) : (
                        <>
                        <Stack.Screen name='Login' component={Login} options={{headerShown: false}} />
                        </>
                    )}
                    
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}
