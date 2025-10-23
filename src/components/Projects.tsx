import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiCode, HiDatabase, HiOfficeBuilding, HiCog } from 'react-icons/hi';
import { SiBootstrap } from 'react-icons/si';

const projects = [
  {
    title: 'Al Madina Hypermarket Website',
    description: 'A modern, fully responsive React-based website for Al Madina Hypermarket - Abu Dhabi\'s trusted neighbourhood hypermarket since 1971. Live production website with smooth animations, dark mode support, and interactive elements.',
    image: '/images/almadina-website.jpg',
    technologies: [
      { name: 'React 18', icon: HiCode },
      { name: 'Vite', icon: HiCog },
      { name: 'Tailwind CSS', icon: SiBootstrap }
    ],
    gradient: 'from-green-500 to-emerald-500',
    features: [
      '19 Branch locations',
      'Dark mode support',
      'Framer Motion animations',
      'Mobile app integration',
      'Live in production'
    ],
    featured: true,
    liveUrl: 'https://almadinahypermarket.ae',
    status: 'Live'
  },
  {
    title: 'Skien.Suite',
    description: 'A comprehensive ERP solution, integrating core business modules for seamless operations, collaboration, and efficiency.',
    image: '/images/skien.png',
    technologies: [
      { name: '.NET Core', icon: HiCode },
      { name: 'SQL Server', icon: HiDatabase }
    ],
    gradient: 'from-blue-500 to-cyan-500',
    featured: true
  },
  {
    title: 'IT Asset Management System',
    description: 'A comprehensive web-based application for managing IT assets, tracking services, handling transfers between branches, and generating detailed reports with interactive dashboards. Production-ready system with complete CRUD operations.',
    image: '/images/asset-management.jpg',
    technologies: [
      { name: '.NET 10', icon: HiCode },
      { name: 'EF Core', icon: HiDatabase },
      { name: 'Bootstrap 5', icon: SiBootstrap }
    ],
    gradient: 'from-purple-500 to-pink-500',
    features: [
      'Multi-branch support',
      'Transfer workflows',
      'Service tracking',
      'Audit logging',
      'Responsive dashboard'
    ],
    featured: true
  }
];

export default function Projects() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="projects" className="min-h-screen py-20 px-4 bg-gray-50 dark:bg-gray-800" ref={ref}>
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          My Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="glass-card overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              {/* Project Image with Gradient Overlay */}
              <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
                {project.image.includes('skien') ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${project.gradient} p-8`}>
                    <div className="text-center text-white">
                      <HiOfficeBuilding className="mx-auto mb-4" size={80} />
                      <h4 className="text-2xl font-bold">{project.title}</h4>
                      {project.status && (
                        <span className="inline-block mt-2 px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                          {project.status}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, i) => (
                    <motion.span
                      key={i}
                      className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800"
                      whileHover={{ scale: 1.05 }}
                    >
                      <tech.icon size={16} />
                      {tech.name}
                    </motion.span>
                  ))}
                </div>

                {/* Features (if available) */}
                {project.features && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Key Features:</p>
                    <ul className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                      {project.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="text-green-500">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Live URL Button */}
                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <HiOfficeBuilding size={16} />
                    View Live Site
                  </motion.a>
                )}
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} blur-xl opacity-20`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add More Projects Coming Soon Card */}
        <motion.div
          className="mt-12 glass-card p-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-semibold mb-4 gradient-text">More Projects Coming Soon!</h3>
          <p className="text-gray-700 dark:text-gray-300">
            I'm constantly working on new and exciting projects. Stay tuned for updates!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
