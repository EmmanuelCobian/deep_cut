import { useState, useEffect } from 'react';
import './App.css';
import supabase from './utils/supabase';

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getTodos = async () => {
      const { data: todos, error } = await supabase.from('todos').select('*');
      if (error) console.error(error);

      console.log(todos);

      if (todos.length > 0) {
        setTodos(todos);
      }
    };

    getTodos();
  }, []);

  return (
    <>
      <h1>Deep Cut</h1>
      <div>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.todo}</li>
        ))}
      </div>
    </>
  );
}

export default App;
