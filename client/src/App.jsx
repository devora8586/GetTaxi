import React from 'react';
import Main from './components/Main.jsx';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';



function App() {


  return (
    <React.StrictMode>
      <PrimeReactProvider>
        <Main />
      </PrimeReactProvider>
    </React.StrictMode>

  );
}

export default App
