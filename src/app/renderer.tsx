import { createRoot } from 'react-dom/client';
import * as React from 'react';
import Dashboard from "./components/Dashboard";

const root = document.getElementById('renderer');
if (root) {
  const domRoot = createRoot(root);
  domRoot.render(<Dashboard />);
}

