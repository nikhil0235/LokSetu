import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AppIcon = ({ name, size = 24, color = '#374151', style, ...props }) => {
  return (
    <Icon 
      name={name} 
      size={size} 
      color={color} 
      style={style}
      {...props}
    />
  );
};

export default AppIcon;