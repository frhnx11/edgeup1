import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo and Copyright */}
        <div className="flex flex-col items-center md:items-start">
          <div className="text-2xl font-bold text-[#094d88]">EdgeUp</div>
          <p className="text-sm text-gray-500 mt-2">
            © {currentYear} EdgeUp Education. All rights reserved.
          </p>
        </div>
        
        {/* Social Links */}
        <div className="flex space-x-4">
          <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#094d88] hover:text-white transition-colors">
            <Facebook size={20} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#094d88] hover:text-white transition-colors">
            <Twitter size={20} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#094d88] hover:text-white transition-colors">
            <Instagram size={20} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#094d88] hover:text-white transition-colors">
            <Linkedin size={20} />
          </a>
        </div>
      </div>
      
      {/* Links */}
      <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
        <a href="#" className="hover:text-[#094d88] transition-colors">Privacy Policy</a>
        <span>•</span>
        <a href="#" className="hover:text-[#094d88] transition-colors">Terms of Service</a>
        <span>•</span>
        <a href="#" className="hover:text-[#094d88] transition-colors">Help Center</a>
        <span>•</span>
        <a href="#" className="hover:text-[#094d88] transition-colors">Contact Us</a>
      </div>
    </footer>
  );
}
