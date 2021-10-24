import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Navbar from '../components/Navbar';

import UsersPage from '../pages/UsersPage';
import ClientsPage from '../pages/ClientsPage';
import EmployeesPage from '../pages/EmployeesPage';
import ShippingPage from '../pages/ShippingPage';

const MainContainer = () => {
  return (
    <Router>
      <Navbar />
      {/* Routes */}
      <Switch>
        <Route path='/' exact={true}>
          <UsersPage />
        </Route>
        <Route path='/clients'>
          <ClientsPage />
        </Route>
        <Route path='/employees'>
          <EmployeesPage />
        </Route>
        <Route path='/shipping'>
          <ShippingPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default MainContainer;
