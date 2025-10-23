import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiBriefcase, HiAcademicCap, HiGlobeAlt, HiBadgeCheck } from 'react-icons/hi';

const experiences = [
  {
    title: 'Software Developer',
    company: 'Al Madina Group',
    period: 'Sep 2025 – Present',
    description: 'Currently working as a Software Developer at Al Madina Group in Abu Dhabi, UAE. Developing and maintaining enterprise-level applications using modern technologies and best practices. Contributing to full-stack development initiatives and ensuring high-quality software delivery.'
  },
  {
    title: 'Senior Software Developer',
    company: 'Skien Software Lab',
    period: 'Sep 2023 – Sep 2025',
    description: 'Engineered and sustained professional .NET web and mobile applications for business clients. Utilized HTML, CSS, Angular.js, and jQuery for frontline web application development. Executed .NET Core 6, C#, .NET MVC, Entity Framework, and SQL Server for robust backend solutions. Developed Skien.Suite (ERP) and contributed to Skien.eCommerce (AI-driven eCommerce). Led technical initiatives and mentored junior developers.'
  },
  {
    title: 'Software Developer',
    company: 'Skien Software Lab',
    period: 'Oct 2021 – Sep 2023',
    description: 'Engineered and maintained .NET web and mobile applications for business clients. Developed and enhanced front-end applications using HTML, CSS, Angular.js, and jQuery. Built backend solutions with .NET Core 6, C#, .NET MVC, Entity Framework, and SQL Server. Assisted in troubleshooting, debugging, and resolving software issues.'
  },
  {
    title: 'Onsite Support',
    company: 'FOODWORLD, Bahrain',
    period: 'May 2023 – Feb 2024',
    description: 'Administered onsite support to ensure seamless application performance while resolving technical issues. Facilitated data correction and collaborated with the client to implement fixes and optimize performance.'
  }
];

const education = [
  {
    degree: "Bachelor's Degree, Computer Science",
    school: 'UNIVERSITY OF CALICUT',
    period: '2018 – 2021',
    location: 'Kerala, India'
  },
  {
    degree: 'Secondary School',
    school: 'VIVEKANANDA VOCATIONAL HIGHER SECONDARY SCHOOL',
    period: 'Mar 2016 – Mar 2018',
    location: 'Poredom'
  }
];

const certifications = [
  {
    title: '1 Million Prompters',
    issuer: 'AI & Prompt Engineering',
    year: '2024'
  }
];

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="about" className="min-h-screen py-20 px-4 bg-white dark:bg-gray-900" ref={ref}>
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          About Me
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Who I Am */}
          <motion.div
            className="glass-card p-8"
            variants={itemVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <div className="flex items-center gap-3 mb-4">
              <HiGlobeAlt className="text-blue-600 dark:text-blue-400" size={32} />
              <h3 className="text-2xl font-semibold">Who I Am</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              I am a dedicated and results-driven senior full-stack developer with over 4 years of experience in designing, developing,
              and maintaining robust web applications. My expertise spans across both front-end and back-end technologies, ensuring
              seamless integration and performance.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Proficient in modern web technologies and frameworks, I excel in creating user-friendly interfaces and scalable server-side logic.
              My collaborative approach and strong problem-solving skills enable me to work effectively within diverse teams, delivering
              high-quality solutions that meet client and business requirements.
            </p>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Languages:</span>
              <span>Malayalam, English, Tamil, Hindi</span>
            </div>
          </motion.div>

          {/* Education & Certifications */}
          <div className="space-y-6">
            <motion.div
              className="glass-card p-8"
              variants={itemVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <HiAcademicCap className="text-blue-600 dark:text-blue-400" size={32} />
                <h3 className="text-2xl font-semibold">Education</h3>
              </div>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <motion.div
                    key={index}
                    className="border-l-4 border-blue-500 dark:border-blue-400 pl-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <h4 className="font-semibold text-lg">{edu.degree}</h4>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">{edu.school}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{edu.period}</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{edu.location}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              className="glass-card p-8"
              variants={itemVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <HiBadgeCheck className="text-blue-600 dark:text-blue-400" size={32} />
                <h3 className="text-2xl font-semibold">Certifications</h3>
              </div>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    className="border-l-4 border-green-500 dark:border-green-400 pl-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <h4 className="font-semibold text-lg">{cert.title}</h4>
                    <p className="text-green-600 dark:text-green-400 text-sm">{cert.issuer}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{cert.year}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Experience Timeline */}
        <motion.div
          className="glass-card p-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="flex items-center gap-3 mb-8">
            <HiBriefcase className="text-blue-600 dark:text-blue-400" size={32} />
            <h3 className="text-2xl font-semibold">Experience</h3>
          </div>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                className="relative border-l-4 border-blue-500 dark:border-blue-400 pl-8 pb-8"
                variants={itemVariants}
              >
                {/* Timeline dot */}
                <div className="absolute left-[-10px] top-0 w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400 border-4 border-white dark:border-gray-900" />

                <h4 className="text-xl font-semibold">{exp.title}</h4>
                <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{exp.period}</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{exp.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
