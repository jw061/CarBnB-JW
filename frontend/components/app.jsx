const React = require('react');
const Link = require('react-router').Link;
const SessionStore = require('../stores/session_store');
const SessionActions = require('../actions/session_actions');
const NavBar = require('./navbar');
const CarMap = require('./car_map')
const Search = require('./search')

const App = React.createClass({

  componentDidMount() {
   SessionStore.addListener(this.forceUpdate.bind(this));
 },

  _handleLogOut(e){
    e.preventDefault();
    SessionActions.logOut();
  },

  greeting(){
    if (SessionStore.isUserLoggedIn()) {
      return(
        <div>
        </div>
      )
    }
    else {
      return(
        <nav>
        </nav>
      );
    }
  },

  render(){
    return(
      <div className='root'>

        <div className='rootNavBar'>
          <NavBar />
        </div>
        
        <div>
          {this.props.children}
        </div>

      </div>
    )
  }
})


module.exports = App;
