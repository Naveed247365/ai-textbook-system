import React from 'react';

interface IconTextProps {
  icon: string;
  text: string;
}

const IconText: React.FC<IconTextProps> = ({ icon, text }) => {
  return (
    <span>
      {icon} {text}
    </span>
  );
};

export default IconText;
