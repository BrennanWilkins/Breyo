import React, { Suspense } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Spinner from './components/UI/Spinner/Spinner';
const HomePage = React.lazy(() => import('./components/HomePage/HomePage/HomePage'));
const DashboardPage = React.lazy(() => import('./components/DashboardPage/Dashboard/Dashboard'));
const LoginPage = React.lazy(() => import('./components/AuthPages/LoginPage'));
const SignupPage = React.lazy(() => import('./components/AuthPages/SignupPage'));
const ForgotPage = React.lazy(() => import('./components/AuthPages/ForgotPage'));

const App = props => {
  return (
    <BrowserRouter>
      {props.isAuth ?
        <Switch>
          <Route exact path="/" render={() => <Suspense fallback={<Spinner />}><DashboardPage /></Suspense>} />
          <Redirect to="/" />
        </Switch>
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

export default App;
