import { gql, useQuery } from "@apollo/client";
import Table from "react-bootstrap/Table";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdDone } from "react-icons/md";
import { MdDoNotDisturb } from "react-icons/md";
import { useMutation } from "@apollo/client";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation deleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      id
      title
      completed
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($title: String!, $completed: Boolean!) {
    addTodo(title: $title, completed: $completed) {
      id
      title
      completed
    }
  }
`;

const UPDATE_TODO = gql`
  mutation updateTodo($id: ID!, $title: String!) {
    updateTodo(id: $id, title: $title) {
      id
      title
      completed
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation toggleTodo($id: ID!, $completed: Boolean!) {
    toggleTodo(id: $id, completed: $completed) {
      id
      title
      completed
    }
  }
`;


export default function TodoList() {
  const [title, setTitle] = useState("");
  var completed = false;
  const [editMode, setEditMode] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const buttonTitle = editMode ? "Edit Todo" : "Add Todo";
  const [addTodo] = useMutation(ADD_TODO, {
    variables: { title, completed },
    refetchQueries: [{ query: GET_TODOS }],
  });
  const [updateTodo] = useMutation(UPDATE_TODO);
  const modifyTodo = (id) => {
    updateTodo({
      variables: { id: id, title },
      refetchQueries: [{ query: GET_TODOS }],
    });
  };
  const [toggleTodo] = useMutation(TOGGLE_TODO, {
    onError: (error) => {
      console.error("Error toggling todo:", error);
    }
  });
  const markTodo = (id, currentStatus) => {
    console.log("Toggling status for ID:", id, "New Status:", !currentStatus); 
    toggleTodo({
      variables: { id, completed: !currentStatus },
      refetchQueries: [{ query: GET_TODOS }],
    }).catch(error => {
      console.error("Error toggling todo:", error);
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (title === "") return alert("Title is required");
    if (editMode) {
      modifyTodo(editTodo.id);
      setEditMode(false);
      setEditTodo(null);
    } else {
      addTodo();
    }
    setTitle("");
  };
  const { loading, error, data } = useQuery(GET_TODOS);
  const [deleteTodo] = useMutation(DELETE_TODO);
  const removeTodo = (id) => {
    deleteTodo({
      variables: { id: id },
      refetchQueries: [{ query: GET_TODOS }],
    });
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error... :(</p>;
  return (
    <>
      <Form className="form-dark" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter todo"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </Form.Group>
        <Button type="submit">{buttonTitle}</Button>
      </Form>
      {!loading && !error && (
        <Table striped bordered hover responsive variant="dark">
          <thead>
            <tr>
              <th>Todo</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {data.todos.map((todo) => (
              <tr
                key={todo.id}
                style={{ textDecoration: todo.completed ? "line-through" : "" }}
              >
                <td>{todo.title}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => {
                      setTitle(todo.title);
                      setEditMode(true);
                      setEditTodo(todo);
                    }}
                  >
                    <FaEdit />
                  </Button>
                </td>
                <td>
                  <Button variant="danger" onClick={() => removeTodo(todo.id)}>
                    <FaTrash />
                  </Button>
                </td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => {
                      markTodo(todo.id);
                    }}
                  >
                    {todo.completed ? <MdDone /> : <MdDoNotDisturb />}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
