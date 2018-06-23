// TodoBox.js
import React, { Component } from 'react';
import 'whatwg-fetch';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import './TodoBox.css';

class TodoBox extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      error: null,
      todo: '',
      updateId: null,
    };
    this.pollInterval = null;
  }

  componentDidMount() {
    this.loadTodosFromServer();
    if (!this.pollInterval) {
      this.pollInterval = setInterval(this.loadTodosFromServer, 2000);
    }
  }

  componentWillUnmount() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = null;
  }

  onChangeText = (e) => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  onUpdateTodo = (id) => {
    const oldTodo = this.state.data.find(c => c._id === id);
    if (!oldTodo) return;
    this.setState({ text: oldTodo.text, updateId: id });
  }

  onDeleteTodo = (id) => {
    const i = this.state.data.findIndex(c => c._id === id);
    const data = [
      ...this.state.data.slice(0, i),
      ...this.state.data.slice(i + 1),
    ];
    this.setState({ data });
    fetch(`api/todos/${id}`, { method: 'DELETE' })
      .then(res => res.json()).then((res) => {
        if (!res.success) this.setState({ error: res.error });
      });
  }

  submitTodo = (e) => {
    e.preventDefault();
    const { updateId } = this.state;
    if (updateId) {
      this.submitUpdatedTodo();
    } else {
      this.submitNewTodo();
    }
  }

  submitNewTodo = () => {
    const { text } = this.state;
    const data = [...this.state.data, { text, _id: Date.now().toString() }];
    this.setState({ data });
    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) this.setState({ error: res.error.message || res.error });
      else this.setState({ text: '', error: null });
    });
  }

  submitUpdatedTodo = () => {
    const { text, updateId } = this.state;
    fetch(`/api/todos/${updateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) this.setState({ error: res.error.message || res.error });
      else this.setState({ text: '', updateId: null });
    });
  }

  loadTodosFromServer = () => {
    fetch('/api/todos/')
      .then(data => data.json())
      .then((res) => {
        if (!res.success) this.setState({ error: res.error });
        else this.setState({ data: res.data });
      });
  }

  render() {
    return (
      <div className="container">
        <div className="todos">
          <h2>To Do:</h2>
          <TodoList
            data={this.state.data}
            handleDeleteTodo={this.onDeleteTodo}
            handleUpdateTodo={this.onUpdateTodo}
          />
        </div>
        <div className="form">
          <TodoForm
            text={this.state.text}
            handleChangeText={this.onChangeText}
            submitTodo={this.submitTodo}
          />
        </div>
        {this.state.error && <p>{this.state.error}</p>}
      </div>
    );
  }
}

export default TodoBox;
