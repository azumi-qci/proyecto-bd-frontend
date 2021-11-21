import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { Content, Header, Footer } from 'antd/lib/layout/layout';

import Navbar from '../components/Navbar';
import MyFooter from '../components/Footer';

import ClientsPage from '../pages/ClientsPage';
import EmployeesPage from '../pages/EmployeesPage';
import PackagesPage from '../pages/PackagesPage';
import DeliveryPage from '../pages/DeliveryPage';
import BusinessPage from '../pages/BusinessPage';

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
            <Route path='/packages'>
              <PackagesPage />
            </Route>
            <Route path='/delivery'>
              <DeliveryPage />
            </Route>
            <Route path='/business'>
              <BusinessPage />
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
