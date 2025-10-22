import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function EducationSection({ education, certifications }) {
  if ((!education || education.length === 0) && (!certifications || certifications.length === 0)) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center">
              Education & Certifications
            </h2>
            <p className="text-slate-600 text-center mb-16 text-lg">
              My academic background and professional credentials
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Education */}
            {education && education.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                  Education
                </h3>
                {education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-300 border-slate-200">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg mt-1">
                            <GraduationCap className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-slate-900 mb-1">
                              {edu.degree}
                            </h4>
                            {edu.field && (
                              <p className="text-indigo-600 font-medium mb-2">
                                {edu.field}
                              </p>
                            )}
                            <p className="text-slate-600 font-medium mb-1">
                              {edu.institution}
                            </p>
                            {edu.year && (
                              <p className="text-sm text-slate-500 mb-2">
                                {edu.year}
                              </p>
                            )}
                            {edu.description && (
                              <p className="text-slate-600 text-sm leading-relaxed">
                                {edu.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-purple-600" />
                  Certifications
                </h3>
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-300 border-slate-200">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg mt-1">
                            <Award className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-slate-900 mb-1">
                              {cert.name}
                            </h4>
                            <p className="text-purple-600 font-medium mb-1">
                              {cert.issuer}
                            </p>
                            {cert.date && (
                              <p className="text-sm text-slate-500">
                                {cert.date}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}