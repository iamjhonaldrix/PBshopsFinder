function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-2 w-full absolute bottom-0">
            <div className="text-center text-sm p-4">
                &copy; {new Date().getFullYear()} PBshops. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;