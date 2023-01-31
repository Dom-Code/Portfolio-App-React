import React, { useEffect } from 'react';
import { publicProps } from '../App';
import { useNavigate } from 'react-router-dom';

const PublicHome = ({ profileId }: publicProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/public/${profileId}`);
  }, [profileId, navigate]);
  return <></>;
};

export default PublicHome;
