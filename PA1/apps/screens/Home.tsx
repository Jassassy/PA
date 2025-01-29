import {View, Text, Button, StyleSheet, SafeAreaView} from 'react-native'; 
import React, { useEffect, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FireBaseConfig';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { addDoc, collection, doc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FireBaseConfig';


interface Props {
    navigation: NavigationProp<any, any>;
}

export interface Todo {
	isComplete: boolean;
	userID: string;
	title: string;
}

const Home = ({ navigation}: Props) => {
    const [todos, setTodos] = useState<any[]>([]);
    const [todo, setTodo] = useState('');

    useEffect(() => {
        const todoRef = collection(FIREBASE_DB, 'todos');
    
        const subscriber = onSnapshot(todoRef, {
            next: (snapshot) => {
                const todos: any[] = [];
                snapshot.docs.forEach((doc) => {
                    todos.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
    
                setTodos(todos);
            }
        });
    
        // // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, []);

    const addTodo = async () => {
        try {
            const docRef = await addDoc(collection(FIREBASE_DB, 'todos'), {
                title: todo,
                done: false
            });
            setTodo('');
            console.log('Document written with ID: ', docRef.id);
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    };
    return (
        //  <View>
        //     <Button onPress={() => FIREBASE_AUTH.signOut()} title='Sign Out' />
        // </View>
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <TextInput style={styles.input} placeholder='Add Todo' 
                onChangeText={(text:string)=> setTodo(text)} value={todo}/>
                <Button onPress={addTodo} title="Add Todo" />
            </View>
                <FlatList 
                    data={todos} 
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                    <View style={styles.todoContainer}>
                        <Text style={styles.todoText}>{item.title}</Text>
                    </View>
                    )} />
            <Button onPress={() => FIREBASE_AUTH.signOut()} title='Sign Out' />
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
	container: {
		flex: 1,
        marginHorizontal: 20
	},
	form: {
		marginVertical: 20,
		flexDirection: 'column',
		//alignItems: 'center'
	},
	input: {
		flex: 1,
		height: 40,
		borderWidth: 1,
		borderRadius: 4,
		padding: 10,
		backgroundColor: '#fff'
	},
    todo: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center'
	},
	todoText: {
		flex: 1,
		paddingHorizontal: 4
	},
	todoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		padding: 10,
		marginVertical: 4
	}
});