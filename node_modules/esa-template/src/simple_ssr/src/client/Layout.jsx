import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <header>
        <ul style={{ display: 'flex', listStyle: 'none' }}>
          <li style={{ marginRight: '10px' }}><a href="/">game</a></li>
          <li><a href="/hello">hello</a></li>
        </ul>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>Your Footer here</footer>
    </>
  );
};

export default Layout;