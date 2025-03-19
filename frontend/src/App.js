import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Menu from './Components/Menu';
import Cart from './Components/Cart';
import OrderStatus from './Components/OrderStatus';
import AdminDashboard from './Components/AdminDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>Restaurant Order System</h1>
          <nav>
            <Link to="/">Menu</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </header>
        
        <main>
          <Switch>
            <Route path="/" exact component={Menu} />
            <Route path="/cart" component={Cart} />
            <Route path="/orders" component={OrderStatus} />
            <Route path="/admin" component={AdminDashboard} />
          </Switch>
        </main>
        
        <footer>
          <p>&copy; 2025 Restaurant Order System</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;