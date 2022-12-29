import React from 'react';
import ReactDOM from 'react-dom/client';
import  {App} from "./components/app"
import reportWebVitals from './reportWebVitals';
import "./styles/styles.css"
import { ApolloProvider } from '@apollo/client';
import { client } from './styles/apollo';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(

    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>

);

reportWebVitals();
