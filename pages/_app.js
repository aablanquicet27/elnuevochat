import React from 'react';

// Componente simple para evitar problemas de importación
const App = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default App;
