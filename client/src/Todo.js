import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const Todo = props => (
  <div className="singleTodo">
    <div className="textContent">
      <div className="singleTodoContent">
        <ReactMarkdown source={props.children} />
        <div className="singleTodoButtons">
          <a onClick={() => { props.handleUpdateTodo(props.id); }}>edit</a>
          <a onClick={() => { props.handleDeleteTodo(props.id); }}>delete</a>
        </div>
      </div>
    </div>
  </div>
);

Todo.propTypes = {
  children: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  handleUpdateTodo: PropTypes.func.isRequired,
  handleDeleteTodo: PropTypes.func.isRequired,
};

export default Todo;
