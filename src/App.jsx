import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PDFPreview from './components/PDFPreview';

// Import your other components here
// import OtherComponent from './components/OtherComponent';

const App = () => {
  return (
    <Router>
      <div>
        <nav style={{ 
          padding: '10px 20px', 
          backgroundColor: '#f1f1f1', 
          marginBottom: '20px' 
        }}>
          <ul style={{ 
            display: 'flex', 
            listStyleType: 'none', 
            margin: 0, 
            padding: 0, 
            gap: '20px' 
          }}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/pdf-preview">PDF Preview</Link>
            </li>
            {/* Add more navigation links as needed */}
          </ul>
        </nav>

        <Routes>
          {/* <Route path="/pdf-preview" element={<PDFPreview />} /> */}
          {/* Add your other routes here */}
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
