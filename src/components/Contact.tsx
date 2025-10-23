import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaLinkedin } from 'react-icons/fa';

const contactInfo = [
  {
    icon: HiMail,
    title: 'Email',
    value: 'aslammhdms@gmail.com',
    href: 'mailto:aslammhdms@gmail.com',
    gradient: 'from-red-500 to-pink-500'
  },
  {
    icon: HiPhone,
    title: 'Phone',
    value: '+91 8301073018',
    href: 'tel:+918301073018',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: HiLocationMarker,
    title: 'Location',
    value: 'Abu Dhabi, UAE',
    href: '#',
    gradient: 'from-blue-500 to-cyan-500'
  }
];

export default function Contact() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="contact" className="min-h-screen py-20 px-4 bg-gray-50 dark:bg-gray-800" ref={ref}>
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </motion.h2>

        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-card p-8 md:p-12"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl font-semibold mb-4">Let's Connect!</h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                Feel free to reach out to me for any questions or opportunities!
              </p>
            </div>

            {/* Contact Information Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="group relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-transparent transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                  <div className="relative">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon size={28} />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              className="text-center pt-8 border-t border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
            >
              <h4 className="font-semibold mb-6 text-lg">Connect with me on</h4>
              <div className="flex justify-center gap-4">
                <motion.a
                  href="https://www.linkedin.com/in/aslammhdms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaLinkedin size={32} />

                  {/* Tooltip */}
                  <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    LinkedIn Profile
                  </span>
                </motion.a>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
            >
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
              </p>
              <motion.a
                href="mailto:aslammhdms@gmail.com"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HiMail size={24} />
                Send me an Email
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
