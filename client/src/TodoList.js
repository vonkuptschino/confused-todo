// TodoList.js
import React from 'react';
import PropTypes from 'prop-types';
import Todo from './Todo';

const TodoList = (props) => {
  const todoNodes = props.data.map(todo => (
    <Todo
      key={todo._id}
      id={todo._id}
      handleUpdateTodo={props.handleUpdateTodo}
      handleDeleteTodo={props.handleDeleteTodo}
    >
      { todo.text}
    </Todo>
  ));
  return (
    <div>
      { todoNodes }
    </div>
  );
};

TodoList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string,
  })),
  handleDeleteTodo: PropTypes.func.isRequired,
  handleUpdateTodo: PropTypes.func.isRequired,
};

TodoList.defaultProps = {
  data: [],
};

export default TodoList;
