import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { db, collection, addDoc, deleteDoc, doc, query, onSnapshot, orderBy, updateDoc } from './Firebase/Config';

interface Task { id: string, text: string, isDone: boolean, createdAt: string; }

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);


  const addTask = async () => {
    if (task.trim() === '') return;

    try {
      await addDoc(collection(db, "tasks"), {
        text: task,
        isDone: false,
        createdAt: new Date().toISOString(),
      });
      setTask('');
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  };


  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((document) => {
        tasksData.push({ id: document.id, ...(document.data() as Omit<Task, 'id'>) });
      });
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, []);

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (err) {
      console.error("Error removing document: ", err);
    }
  };

  const toggleTaskDone = async (id: string, currentIsDone: boolean) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, {
        isDone: !currentIsDone
      });
    } catch (err) {
      console.error("Error updating document: ", err);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Work To-Do-List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>


      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleTaskDone(item.id, item.isDone)} style={styles.taskTextContainer}>
              <Text style={item.isDone ? styles.taskTextDone : styles.taskText}>{item.text}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButtonContainer}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        style={styles.taskList}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '90%',
    marginBottom: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  taskList: {
    marginTop: 20,
    width: '90%',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
    borderRadius: 8,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 18,
    flexShrink: 1,
    marginRight: 10,
  },
  taskTextDone: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: '#888',
    flexShrink: 1,
    marginRight: 10,
  },
  deleteButtonContainer: {
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ffe6e6',
    borderRadius: 5,
  },
});
