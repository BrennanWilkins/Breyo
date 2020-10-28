import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Spinner from './components/UI/Spinner/Spinner';
import { connect } from 'react-redux';
import { autoLogin } from './store/actions';
import Notifications from './components/Notifications/Notifications';
import NavBar from './components/NavBar/NavBar/NavBar';
const HomePage = React.lazy(() => import('./components/HomePage/HomePage/HomePage'));
const DashboardPage = React.lazy(() => import('./components/DashboardPage/Dashboard/Dashboard'));
const LoginPage = React.lazy(() => import('./components/AuthPages/LoginPage'));
const SignupPage = React.lazy(() => import('./components/AuthPages/SignupPage'));
const ForgotPage = React.lazy(() => import('./components/AuthPages/ForgotPage'));

const App = props => {
  useEffect(() => props.autoLogin(), []);

  return (
    <BrowserRouter>
      {props.isAuth ?
        <>
          <NavBar />
          <Notifications />
          <Switch>
            <Route exact path="/" render={() => <Suspense fallback={<Spinner />}><DashboardPage /></Suspense>} />
            <Redirect to="/" />
          </Switch>
        </>
        :
        <Switch>
          <Route exact path="/" render={() => <Suspense fallback={<Spinner />}><HomePage /></Suspense>} />
          <Route exact path="/login" render={() => <Suspense fallback={<Spinner />}><LoginPage /></Suspense>} />
          <Route exact path="/signup" render={() => <Suspense fallback={<Spinner />}><SignupPage /></Suspense>} />
          <Route exact path="/forgot-password" render={() => <Suspense fallback={<Spinner />}><ForgotPage /></Suspense>} />
          <Redirect to="/" />
        </Switch>
      }
    </BrowserRouter>
  );
};

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth
});

const mapDispatchToProps = dispatch => ({
  autoLogin: () => dispatch(autoLogin())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
