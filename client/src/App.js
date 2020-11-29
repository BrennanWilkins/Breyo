import React, { Suspense, useEffect, lazy } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from './components/UI/Spinner/Spinner';
import { connect } from 'react-redux';
import { autoLogin } from './store/actions';
import Notifications from './components/Notifications/Notifications';
import NavBar from './components/NavBar/NavBar/NavBar';
import TempNavBar from './components/UI/TempNavBar/TempNavBar';
const HomePage = lazy(() => import('./components/HomePages/HomePage/HomePage'));
const DashboardPage = lazy(() => import('./components/DashboardPage/Dashboard/Dashboard'));
const LoginPage = lazy(() => import('./components/AuthPages/LoginPage'));
const SignupPage = lazy(() => import('./components/AuthPages/SignupPage'));
const ForgotPage = lazy(() => import('./components/AuthPages/ForgotPage'));
const BoardPage = lazy(() => import('./components/BoardPage/BoardPage/BoardPage'));
const HelpPage = lazy(() => import('./components/HomePages/HelpPage/HelpPage'));

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
            <Route path="/board/:boardID" render={() => <Suspense fallback={<Spinner />}><BoardPage /></Suspense>} />
            <Route exact path="/help" render={() => <Suspense fallback={<Spinner />}><HelpPage isAuth /></Suspense>} />
            <Redirect to="/" />
          </Switch>
        </>
        :
        props.autoLoginLoading ? <TempNavBar /> :
        <Switch>
          <Route exact path="/" render={() => <Suspense fallback={<Spinner />}><HomePage /></Suspense>} />
          <Route exact path="/login" render={() => <Suspense fallback={<Spinner />}><LoginPage /></Suspense>} />
          <Route exact path="/signup" render={() => <Suspense fallback={<Spinner />}><SignupPage /></Suspense>} />
          <Route exact path="/forgot-password" render={() => <Suspense fallback={<Spinner />}><ForgotPage /></Suspense>} />
          <Route exact path="/help" render={() => <Suspense fallback={<Spinner />}><HelpPage /></Suspense>} />
          <Redirect to="/" />
        </Switch>
      }
    </BrowserRouter>
  );
};

App.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  autoLoginLoading: PropTypes.bool.isRequired,
  autoLogin: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth,
  autoLoginLoading: state.auth.autoLoginLoading
});

const mapDispatchToProps = dispatch => ({
  autoLogin: () => dispatch(autoLogin())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
