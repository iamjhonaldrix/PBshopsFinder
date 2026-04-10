function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-2 w-full mt-auto">
            <div className="text-center text-sm p-4">
                &copy; {new Date().getFullYear()} PBshops. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;