import React from "react";

const PageNotFound: React.FC = () => {
  return (
    <div className="container mx-auto text-center py-16">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-2xl mt-4">Page Not Found</p>
      <p className="mt-6">The page you are looking for does not exist. You may have mistyped the address, or the page may have moved.</p>
      <a href="/" className="mt-8 inline-block bg-blue-500 text-white py-2 px-4 rounded">
        Go Back to Home
      </a>
    </div>
  );
};

export default PageNotFound;
