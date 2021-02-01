
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import ApolloProvider from './ApolloProvider'
import { AuthProvider } from './context/auth'
import { MessageProvider } from './context/message'
import GuardRoute from './guards/GuardRoute'

import SignIn from './offline/SignIn';
import SignUp from './offline/SignUp';
import Chat from './online/Chat';

function App() {
  return  (<div className="App">
    <ApolloProvider>
      <AuthProvider>
        <Router>
          <Switch>
            <GuardRoute path="/login" component={SignIn} guest />
            <GuardRoute path="/register" component={SignUp} guest />
            <MessageProvider>
              <GuardRoute path="/" component={Chat} authenticated  />
            </MessageProvider>
          </Switch>
        </Router>
      </AuthProvider>
    </ApolloProvider>
    </div>);
}

export default App;
