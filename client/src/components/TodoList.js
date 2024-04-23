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
      id,
      title,
      completed
    }
  }
`;

export default function TodoList() {
  const [title, setTitle] = useState("");
  const completed = false;
  const [addTodo] = useMutation(ADD_TODO, {
    variables: { title, completed },
    refetchQueries: [{ query: GET_TODOS }],
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo();
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
                onChange={e => setTitle(e.target.value)}
                value={title} 
            />
        </Form.Group>
        <Button type="submit">
            Add Todo
        </Button>
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
              <tr key={todo.id}>
                <td>{todo.title}</td>
                <td>
                  <FaEdit />
                </td>
                <td>
                  <Button variant="danger" onClick={() => removeTodo(todo.id)}>
                    <FaTrash />
                  </Button>
                </td>
                <td>
                {todo.completed ? 
                   <MdDone />  : <MdDoNotDisturb />
                }
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}
