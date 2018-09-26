import React, { Component } from 'react';
import firebase from './firebase.js';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      currentItem: '',
      usernamme: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }


  render() {
    return (
      <div className="App">
        <header>
          <div className="wrapper">
            <h1>Fun Food Friends</h1>

          </div>
        </header>
        <div className="container">
          <section className="add-item">
            <form action="">
              <input type="text" name="username" placeholder="What's your name?" onChange={this.handleChange} value={this.state.username}/>
              <input type="text" name="currentItem" placeholder="What are you bringing?" onChange={this.handleChange} value={this.state.currentItem}/>
              <button>Add Item</button>
            </form>
          </section>
          <section className="display-item">
            <div className="wrapper">
              <ul>

              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default App;
