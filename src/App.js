import React, {Component} from 'react';
import firebase, { auth, provider } from './firebase.js';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      items: [],
      currentUser: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  login() {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }
  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }

  handleSubmit(e) {
    // prevent default behavior of form - if we don't, the window will reload when submit button clicked
    e.preventDefault();

    // carve space in firebase db where we'd like to store items users are submitting from form.
    // do this by calling ref() method and pass in dest. where they will be stored ('items')
    const itemsRef = firebase.database().ref(`items`);

    // grab item(and username) user typed in from state -> pkg into object to be sent to firebase db
    const item = {
      title: this.state.currentItem,
      user: this.state.user.displayName || this.state.user.email
    }

    // similar to array.push method - sends item object to db
    itemsRef.push(item);

    // clears inputs so we can add further
    this.setState({
      currentItem: '',
      username: ''
    })
  }

  componentDidMount() {


// check firebase db to see if user was previously signed in:
    auth.onAuthStateChanged((user)=>{
      if (user) {
        this.setState({user})
      }
    });

    const itemsRef = firebase.database().ref(`items`);
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({id: item, title: items[item].title, user: items[item].user});
      }
      this.setState({items: newState});
    });
  }

  removeItem(itemId){
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }

  render() {
    return (<div className="App">
      <header>
        <div className="wrapper">
          <div>
            <h1>Potluck signup app</h1>
            <i className="fa fa-shopping-basket" aria-hidden="true"></i>
          </div>

          {this.state.user ?
            <button onClick={this.logout}>Log Out</button>
            :
            <button onClick={this.login}>Log In</button>
          }
        </div>
      </header>
      {this.state.user ?
        <div>
          <div className='user-profile'>
            <img src={this.state.user.photoURL} alt="${this.state.}"/>
          </div>
          <div className='container'>
            <section className='add-item'>
              <form onSubmit={this.handleSubmit}>
                <input type="text" name="username" placeholder="What's your name?" value={this.state.user.displayName || this.state.user.email} />
                <input type="text" name="currentItem" placeholder="What are you bringing?" onChange={this.handleChange} value={this.state.currentItem} />
                <button>Add Item</button>
              </form>
            </section>
            <section className="display-item">
              <div className="wrapper">
                <ul>
                  {this.state.items.map((item)=>{
                    return(
                      <li key={item.id}>
                        <h3>{item.title}</h3>
                        <p>brought by: {item.user}
                          {item.user === this.state.user.displayName || item.user === this.state.user.email ?
                       <button onClick={() => this.removeItem(item.id)}>Remove Item</button> : null}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </section>
          </div>
        </div>
        :
        <div className='wrapper'>
          <p>You must be logged in to see the potluck list and submit to it.</p>
        </div>
        }



    </div>);
  }
}

export default App;
