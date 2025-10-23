import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiCode, HiUsers, HiLightBulb, HiClock, HiCheckCircle } from 'react-icons/hi';
import { BiMessageDetail } from 'react-icons/bi';

const technicalSkills = [
  { name: '.NET Core / .NET Framework / ASP.NET MVC', level: 95 },
  { name: 'C# / Entity Framework / SQL Server', level: 90 },
  { name: 'HTML / CSS / JavaScript / Angular.js / jQuery', level: 90 },
  { name: 'DevOps / CI/CD / Azure DevOps', level: 85 },
  { name: 'RESTful API / Web Services', level: 85 }
];

const professionalSkills = [
  { name: 'Team Collaboration', icon: HiUsers },
  { name: 'Communication', icon: BiMessageDetail },
  { name: 'Problem Solving', icon: HiLightBulb },
  { name: 'Time Management', icon: HiClock },
  { name: 'Detail-oriented', icon: HiCode },
  { name: 'Self-Directed Work Ethic', icon: HiCheckCircle }
];

const tools = [
  'Git', 'SQL Server', 'Visual Studio', 'Postman', 'Jira', 'Azure DevOps', 'Docker'
];

export default function Skills() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="skills" className="min-h-screen py-20 px-4 bg-white dark:bg-gray-900" ref={ref}>
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          My Skills
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Technical Skills */}
          <motion.div
            className="glass-card p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
              <HiCode className="text-blue-600 dark:text-blue-400" size={32} />
              Technical Skills
            </h3>
            <div className="space-y-6">
              {technicalSkills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full relative overflow-hidden"
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/30"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'linear'
                        }}
                      />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Professional Skills */}
          <motion.div
            className="glass-card p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold mb-8">Professional Skills</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {professionalSkills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <skill.icon className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={24} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                </motion.div>
              ))}
            </div>

            <h3 className="text-xl font-semibold mb-4">Tools & Technologies</h3>
            <div className="flex flex-wrap gap-3">
              {tools.map((tool, index) => (
                <motion.span
                  key={index}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full font-medium border border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
