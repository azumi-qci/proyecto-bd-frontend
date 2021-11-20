import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { Content, Header, Footer } from 'antd/lib/layout/layout';

import Navbar from '../components/Navbar';
import MyFooter from '../components/Footer';

import ClientsPage from '../pages/ClientsPage';
import EmployeesPage from '../pages/EmployeesPage';
import ShippingPage from '../pages/ShippingPage';

const MainContainer = () => {
  return (
    <Layout>
      <Router>
        <Header>
          <Navbar />
        </Header>

        {/* Routes */}
        <Content>
          <Switch>
            <Route path='/' exact={true}>
              <EmployeesPage />
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
        </Content>

        <Footer>
          <MyFooter />
        </Footer>
      </Router>
    </Layout>
  );
};

export default MainContainer;
