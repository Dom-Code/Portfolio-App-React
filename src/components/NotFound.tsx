import React from 'react';
import { useParams } from 'react-router-dom';

const NotFound = () => {
  const { param } = useParams();
  return (
    <div>
      <h3>{param ? param : 'Page'} Not Found</h3>
    </div>
  );
};

export default NotFound;
