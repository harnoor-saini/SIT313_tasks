import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer(){
    return(
        <footer className="site-footer">

            <div className="footer-columns">
                <div className="footer-col">
                    <h4>Explore</h4>
                    <a href="/">Home</a>
                    <a href="/questions">Questions</a>
                    <a href="/articles">Articles</a>
                    <a href="/tutorials">Tutorials</a>
                </div>
                <div className="footer-col">
                    <h4>Support</h4>
                    <a href="/faqs">FAQs</a>
                    <a href="/help">Help</a>
                    <a href="/contact">Contact Us</a>
                </div>
                <div className="footer-col">
                    <h4>Stay connected</h4>
                    <div className="social-icons">
                        <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                        <a href="#" aria-label="Twitter"><FaTwitter /></a>
                        <a href="#" aria-label="Instagram"><FaInstagram /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>DEV@Deakin 2026</p>
                <div className="footer-links">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms</a>
                    <a href="/code-of-conduct">Code of Conduct</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;