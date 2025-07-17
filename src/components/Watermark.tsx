import React from "react";

const Watermark = () => {
  return (
    <a
      href="https://instagram.com/YOUR_USERNAME"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 opacity-70 hover:opacity-100 transition-opacity"
    >
      <img
        src="/src/assets/paras-logo.png"
        alt="Paras Watermark"
        className="w-12 h-12 rounded-full shadow-md border border-pink-500"
      />
    </a>
  );
};

export default Watermark;
