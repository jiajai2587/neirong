import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Game from './game';
import HelloWorld from './hello';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Game />} />
        <Route path="hello" element={<HelloWorld />} />
      </Route>
    </Routes>
  );
};

export default App;
