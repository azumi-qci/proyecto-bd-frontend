import React, { useState } from 'react';

import '../styles/Footer.component.css';

const Footer = () => {
  const [currentYear] = useState(new Date().getFullYear());

  return (
    <div className='myFooterContainer'>
      <p>Los tres tristes tigres (menos uno) | © {currentYear}</p>
    </div>
  );
};

export default Footer;
