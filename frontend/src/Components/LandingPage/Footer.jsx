
const Footer = () => {
    return (
        <div>
            <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-20">
                <aside className="grid-flow-col items-center">
                    <img src="/logo.png" alt="Logo" className="w-40 h-40 object-contain" />
                </aside>
                <nav>
                    <h6 className="footer-title">Services</h6>
                    <a className="link link-hover">Branding</a>
                    <a className="link link-hover">Design</a>
                    <a className="link link-hover">Marketing</a>
                    <a className="link link-hover">Advertisement</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Company</h6>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Jobs</a>
                    <a className="link link-hover">Press kit</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Legal</h6>
                    <a className="link link-hover">Terms of use</a>
                    <a className="link link-hover">Privacy policy</a>
                    <a className="link link-hover">Cookie policy</a>
                </nav>
            </footer>

            <footer >
                <div className="border-t border-gray-100 py-6 px-6 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-400">Synapse © 2025 — All Rights Reserved</p>
                    <p className="text-xs text-gray-300 font-semibold uppercase tracking-widest">Made with ♥ for deep thinkers</p>
                </div>
            </footer>
        </div>



    );
}

export default Footer;
