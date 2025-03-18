const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <a href="/" className="text-blue-500 mt-4">
        Go Back to Home
      </a>
    </div>
  );
};

export default UnauthorizedPage;
