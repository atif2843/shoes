import { CreditCard, Truck, ShieldCheck } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faInstagram,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-cyan-600 text-white py-10 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:item-center">
        {/* Brand Info */}
        <div>
          <h2 className="text-lg font-bold">SUPER JUMP</h2>
          <p className="text-sm mt-2">
            Superjump offers this website, including all information, tools, and
            services available from this site to you, the user, policies, and
            notices stated here.
          </p>
        </div>

        {/* Info Links */}
        <div className="grid grid-cols-2 gap-4 mt-4 md:mt-0">
          <div>
            <h3 className="text-md font-semibold">INFO</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>Contact Us</li>
              <li>Releases</li>
              <li>Brands</li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-semibold">POLICIES</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Returns & Exchange</li>
              <li>Terms & Conditions</li>
              <li>Order & Shipping</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        {/* Policies Links */}

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-md font-semibold">Sign Up to Our Newsletter</h3>
          <p className="text-sm mt-2">
            Get the latest beauty secrets and trends. Sign up for our newsletter
            and stay informed about all things beauty.
          </p>
          <div className="mt-3 flex sm:flex-row flex-col items-center flex-wrap">
            <input
              type="email"
              placeholder="Your Email"
              className="p-2 flex-1 text-white mr-1 rounded-md border border-white/20 outline-0"
            />
            <button className="bg-white text-black px-4 py-2 rounded-md sm:mt-0 mt-2 md:mt-2">
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Social Media & Icons */}
      <div className="max-w-6xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center border-t border-white/20 pt-4">
        {/* Social Icons */}
        <div className="flex space-x-4">
          <FontAwesomeIcon
            icon={faTwitter}
            className="w-5 h-5 cursor-pointer hover:text-gray-300"
          />
          <FontAwesomeIcon
            icon={faInstagram}
            className="w-5 h-5 cursor-pointer hover:text-gray-300"
          />
          <FontAwesomeIcon
            icon={faFacebook}
            className="w-5 h-5 cursor-pointer hover:text-gray-300"
          />
        </div>

        {/* Security & Services Icons */}
        <div className="flex space-x-6 mt-4 md:mt-0 text-sm flex-wrap justify-center gap-4">
          <div className="flex items-center space-x-1">
            <CreditCard size={18} /> <span>Secure Payments</span>
          </div>
          <div className="flex items-center space-x-1">
            <Truck size={18} /> <span>Free Delivery</span>
          </div>
          <div className="flex items-center space-x-1 ">
            <ShieldCheck size={18} /> <span>100% Genuine</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom Text */}
      <div className="max-w-6xl mx-auto mt-6 text-center text-sm">
        <span className="font-semibold">Superjump</span> created and maintained
        by <span className="font-semibold">Corpnix</span>
      </div>
    </footer>
  );
}
