import React from 'react';

interface World3DProps {
  className?: string;
  height?: string;
}

export const World3D: React.FC<World3DProps> = ({ 
  className = "", 
  height = "600px" 
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-2xl ${className}`}>
      <div 
        className="w-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
        style={{ height }}
      >
        <iframe 
          src='https://my.spline.design/worldplanet-4OCF29ktItxwxJxQCLgw5ix4/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          className="opacity-90 hover:opacity-100 transition-opacity duration-500"
          title="3D World Planet"
        />
      </div>
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}; 