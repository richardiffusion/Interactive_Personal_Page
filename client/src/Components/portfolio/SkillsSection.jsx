import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function SkillsSection({ skills }) {
  if (!skills || skills.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Technical Skills
          </h2>
          <p className="text-slate-600 text-lg">
            No skills added yet. Add your skills in the Edit Profile section.
          </p>
        </div>
      </section>
    );
  }

  // 按分类分组技能
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Technical Skills
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Technologies and tools I work with to bring ideas to life
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <motion.div
              key={category}
              variants={itemVariants}
              className="mb-12"
            >
              <h3 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
                {category}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {categorySkills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <Badge 
                      className={`
                        px-4 py-3 text-sm font-medium rounded-xl border-2 shadow-sm
                        ${getSkillLevelClass(skill.level)}
                        hover:shadow-md transition-all duration-300 cursor-default
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span>{skill.name}</span>
                        {skill.level && (
                          <span className={`
                            text-xs px-2 py-1 rounded-full font-semibold
                            ${getLevelBadgeClass(skill.level)}
                          `}>
                            {skill.level}
                          </span>
                        )}
                      </div>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 技能水平图例 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-slate-200 shadow-sm">
            <span className="text-sm font-semibold text-slate-700">Skill Levels:</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-slate-600">Expert</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-slate-600">Advanced</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-slate-600">Intermediate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-xs text-slate-600">Beginner</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// 根据技能等级返回对应的样式类
function getSkillLevelClass(level) {
  switch (level?.toLowerCase()) {
    case 'expert':
      return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600';
    case 'advanced':
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600';
    case 'intermediate':
      return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-600';
    case 'beginner':
      return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-600';
    default:
      return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white border-slate-600';
  }
}

// 等级徽章样式
function getLevelBadgeClass(level) {
  switch (level?.toLowerCase()) {
    case 'expert':
      return 'bg-green-700 text-green-100';
    case 'advanced':
      return 'bg-blue-700 text-blue-100';
    case 'intermediate':
      return 'bg-yellow-700 text-yellow-100';
    case 'beginner':
      return 'bg-gray-700 text-gray-100';
    default:
      return 'bg-slate-700 text-slate-100';
  }
}