import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {/* Brand */}
          <motion.div
            className="mb-6 md:mb-0 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold gradient-text mb-2">Aslam Muhammed</h3>
            <p className="text-gray-400">Software Developer</p>
          </motion.div>

          {/* Navigation Links */}
          <motion.nav
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ y: -2 }}
              >
                {link.name}
              </motion.a>
            ))}
          </motion.nav>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 dark:border-gray-900 mb-8" />

        {/* Copyright */}
        <motion.div
          className="text-center text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span>&copy; {currentYear} Aslam Muhammed. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1">
              Built with <FaHeart className="text-red-500 animate-pulse" /> using React & TypeScript
            </span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
