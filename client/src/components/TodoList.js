import { gql, useQuery } from "@apollo/client";
import Table from 'react-bootstrap/Table';
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdDone } from "react-icons/md";


const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      completed
    }
  }
`;

export default function TodoList() {
  const { loading, error, data } = useQuery(GET_TODOS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <>
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
                        <td><FaEdit /></td>
                        <td><FaTrash /></td>
                        <td><MdDone /></td>
                    </tr>
                ))}
            </tbody>
        </Table>
      )}
    </>
  );
}
