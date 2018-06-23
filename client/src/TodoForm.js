// TodoForm.js
import React from 'react';
import PropTypes from 'prop-types';

const TodoForm = props => (
  <form onSubmit={props.submitTodo}>
    
    <input
      type="text"
      name="text"
      placeholder="You need to..."
      value={props.text}
      onChange={props.handleChangeText}
    />
    <button type="submit">Oh, yeah</button>
  </form>
);

TodoForm.propTypes = {
  submitTodo: PropTypes.func.isRequired,
  handleChangeText: PropTypes.func.isRequired,
  text: PropTypes.string,
};

TodoForm.defaultProps = {
  text: '',
};

export default TodoForm;
