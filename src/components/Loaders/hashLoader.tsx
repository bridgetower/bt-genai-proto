const TxHashLoader = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-150px)]">
      <div className="text-center max-w-md mx-auto p-6 bg-white shadow-lg rounded-3xl animate-fade-in">
        <div className="flex justify-center mb-6">
          {/* Custom Loader */}
          <div className="loader border-t-transparent border-blue-500 border-4 border-solid rounded-full w-16 h-16 animate-spin"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Gathering proof of origin</h1>
        <p className="text-yellow-500 mb-6">We are generating your transaction hash on the blockchain. This might take a moment.</p>
      </div>
    </div>
  );
};

export default TxHashLoader;
