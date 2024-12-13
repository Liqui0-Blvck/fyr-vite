import React, { FC } from "react";
import '../styles/index.css';

interface LoadingProps {
  className?: string;
}

const Loading: FC<LoadingProps> = ({ className }) => {
  return (
    <div className={` ${className ? className : 'loading-container'}`}>
      <div className="dot dot1 bg-blue-600"></div>
      <div className="dot dot2 bg-blue-600"></div>
      <div className="dot dot3 bg-blue-600"></div>
      <div className="dot dot4 bg-blue-600"></div>
      <div className="dot dot5 bg-blue-600"></div>
      <div className="dot dot6 bg-blue-600"></div>
    </div>
  );
};

export default Loading;
