import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'
import { Provider } from 'react-redux'
import store from './features/store.js'

import { BASE_URL } from './config.js'

if (BASE_URL) {
  axios.defaults.baseURL = BASE_URL;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <Provider store={store}>
        <App />
  </Provider>
  </React.StrictMode>,
)
