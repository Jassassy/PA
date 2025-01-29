import {View, Text, StyleSheet, ActivityIndicator, Button, KeyboardAvoidingView} from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../FireBaseConfig';
import { TextInput } from 'react-native-gesture-handler';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [email,setEmail] = useState('');
    const [password, setPassword] =  useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
           const response =  await signInWithEmailAndPassword(auth, email, password);
        } catch (error:any) {
            alert('Invalid Email or Password: ' + error.message);
            console.log(error);
        } finally {
        setLoading(false);
        }
    };

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
        } catch (error:any) {
            alert('Error creating account: ' + error.message);
            console.log(error);
        } finally {
        setLoading(false);
        }
    };
    return (
        <View style={styles.container}> 
            <KeyboardAvoidingView behavior='padding'>
                <Text style={styles.header}>To Do List</Text>
                <TextInput style={styles.input} value={email} placeholder='Email' autoCapitalize='none' onChangeText={(text => setEmail(text))}></TextInput>
                <TextInput style={styles.input} secureTextEntry={true} value={password}  placeholder='Password' autoCapitalize='none' onChangeText={(text => setPassword(text))}></TextInput>
                
                {loading ? 
                    (<ActivityIndicator size="large" color={"#0000ff"} />
                    ): <> (
                    <Button title='Sign In' onPress={signIn} />
                    <Button title="Sign Up" onPress={signUp} />
                    )
                
                </>}
            </KeyboardAvoidingView>
        </View>
    );
};

export default Login;
const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center'
    },

    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    }
})