const Header = () => {
    return (
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Employee Directory</h1>
        <div className="space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">New Employee</button>
          <button className="bg-gray-200 px-4 py-2 rounded">Search</button>
          <button className="bg-gray-200 px-4 py-2 rounded">Filter</button>
          <button className="bg-gray-200 px-4 py-2 rounded">Sort</button>
        </div>
      </div>
    );
  };
  export default Header;
  