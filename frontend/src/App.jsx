import React from "react";
import Index from "./components/pages/Index";
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div>
      <Index />
      <Toaster/>
    </div>
  );
};

export default App;
