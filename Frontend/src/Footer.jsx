function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-2 flex">
            <div className="text-center text-white-400 text-sm p-4 flex-1">
                &copy; {new Date().getFullYear()} PBshops. All rights reserved.
            </div>
        </footer>
    );
}
export default Footer