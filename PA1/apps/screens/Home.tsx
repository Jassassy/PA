import {View, Text, Button, StyleSheet, SafeAreaView} from 'react-native'; 
import React, { useEffect, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FireBaseConfig';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { addDoc, collection, doc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FireBaseConfig';
import { deleteDoc, updateDoc } from 'firebase/firestore';



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

    const deleteTodo = async (id: string) => {
        try {
            await deleteDoc(doc(FIREBASE_DB, 'todos', id));
            console.log('Todo deleted:', id);
        } catch (e) {
            console.error('Error deleting document:', e);
        }
    };

    const toggleComplete = async (id: string, isComplete: boolean) => {
        try {
            await updateDoc(doc(FIREBASE_DB, 'todos', id), {
                isComplete: !isComplete
            });
            console.log('Todo updated:', id);
        } catch (e) {
            console.error('Error updating document:', e);
        }
    };
    
    return (
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
                        <Text style={[styles.todoText, item.isComplete && styles.completedTodo]}>{item.title}</Text>
                        <Button title="✔" onPress={() => toggleComplete(item.id, item.isComplete)} />
                        <Button title="❌" onPress={() => deleteTodo(item.id)} />
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
	},
    completedTodo: {
        textDecorationLine: 'line-through',
        color: 'gray',
    },
    
});