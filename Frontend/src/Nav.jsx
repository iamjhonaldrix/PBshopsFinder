function Navigator() {
    return (
       <div className="navigator col-span-12 flex items-center justify-around p-4 bg-gray-900 text-white shadow-xl/40">

            <div className="text-4xl font-bold text-shadow-lg/30"><a href="home">PulongBuhangin</a></div>

            <div className="hidden md:flex space-x-6 text-shadow-lg/30">
                <a href="#" className="hover:text-yellow-400 hover:scale-110">Home</a>
                <a href="#" className="hover:text-yellow-400 hover:scale-110">Businesses</a>
                <a href="#" className="hover:text-yellow-400 hover:scale-110">See Categories</a>
                <a href="#" className="hover:text-yellow-400 hover:scale-110">About</a>
            </div>
            
            <div className="space-x-3 break-inside-auto">
                <button  className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 shadow-xl/30 hover:scale-120">
                    <a href="Signup">Signup</a>
                </button>
            </div>

        </div>
    );
}

export default Navigator