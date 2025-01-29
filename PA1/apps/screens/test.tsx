import {View, Text, Button, StyleSheet, SafeAreaView, Alert, TextInput, FlatList} from 'react-native'; 
import React, { useEffect, useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FireBaseConfig';
import { getDatabase, ref, set, push, onValue, remove, update } from 'firebase/database';

const FIREBASE_DB = getDatabase();


interface Props {
    navigation: NavigationProp<any, any>;
}


const test = ({ navigation}: Props) => {
    const [todos, setTodos] = useState<{ id: string; title: string; isComplete: boolean }[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const user = FIREBASE_AUTH.currentUser;

    useEffect(() => {
        if (!user) return;
        const todoRef = ref(FIREBASE_DB, `users/${user.uid}/todos`);
        onValue(todoRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const todos = Object.keys(data).map(key => ({
                    id: key,
                    title: data[key].name,
                    isComplete: data[key].isComplete,
                    ...data[key]
                }));
            setTodos(todos);
        } else {
            setTodos([]);
        }
    });
    },[user]);

    const addTodo = async () => {
        try {
            if (!newTodo.trim()) {
                Alert.alert('Error', 'Please enter a task');
                return;
            }
            if (!user) {
                Alert.alert('Error', 'User not authenticated.');
                return;
              }
            const todoRef = ref(FIREBASE_DB, `users/${user.uid}/todos`);
            const newTodoRef = push(todoRef);
            set(newTodoRef, {
                name: newTodo,
                isComplete: false
            })
            .then(() => {
                setNewTodo('');
            })
            .catch((error) => {
                Alert.alert('Error', error.message);
            });
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    };

    const deleteTodo = async (id: string) => {
        try {
            if (!user) return;
            const todoRef = ref(FIREBASE_DB, `users/${user.uid}/todos/${id}`);
            remove(todoRef).then(() => {
                Alert.alert('Success', 'Task deleted successfully'); })
            .catch((error) => {
                Alert.alert('Error', error.message);
            });
        } catch (e) {
            console.error('Error deleting document:', e);
        }

    };

    const toggleComplete = async (id: string, isComplete: boolean) => {
        try {
            const todoRef = ref(FIREBASE_DB, `users/${user.uid}/todos/${id}`);
            await update(todoRef, {
                isComplete: !isComplete,
            });
            console.log('Todo updated:', id);
        } catch (e) {
            console.error('Error updating todo: ', e);
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <TextInput style={styles.input} placeholder='Add Todo' 
                onChangeText={(text:string)=> setNewTodo(text)} value={newTodo}/>
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

export default test;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20
    },
    form: {
        marginVertical: 20,
        flexDirection: 'column',
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