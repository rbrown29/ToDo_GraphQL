import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import TodoList from './components/TodoList';
import './App.css';

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <div className="App">
          <h1>Todo App</h1>
          <TodoList />
        </div>
      </ApolloProvider>
    </>
  );
}

export default App;
