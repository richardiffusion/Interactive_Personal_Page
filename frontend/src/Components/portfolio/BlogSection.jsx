import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, ArrowRight, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 确保这行存在
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleCount] = useState(3); // 每次显示3篇文章

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    setError(null); // 重置错误状态
    try {
      const response = await fetch('/blog/api/articles?limit=12');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Expected JSON but got:', text.substring(0, 200));
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      
      // 确保 data 是数组
      if (Array.isArray(data)) {
        setArticles(data);
      } else if (data && Array.isArray(data.data)) {
        setArticles(data.data);
      } else if (data && Array.isArray(data.articles)) {
        setArticles(data.articles);
      } else {
        console.error('Unexpected data format:', data);
        setArticles([]);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      setError(error.message); // 确保这里使用 setError
      setArticles([]);
    }
    setLoading(false);
  };

  // 计算总幻灯片数
  const totalSlides = Math.ceil(articles.length / visibleCount);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // 获取当前幻灯片显示的文章
  const getCurrentArticles = () => {
    if (!Array.isArray(articles) || articles.length === 0) {
        return [];
    }
    
    const startIndex = currentSlide * visibleCount;
    return articles.slice(startIndex, startIndex + visibleCount);
  };

  // 错误状态显示
  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="container mx-auto px-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Failed to load articles
          </h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={loadArticles} className="bg-indigo-600 hover:bg-indigo-700">
            Retry
          </Button>
        </div>
      </section>
    );
  }


  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Latest Articles
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!Array.isArray(articles) || articles.length === 0) {
    return null;
  }

  const currentArticles = getCurrentArticles();

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Latest Articles
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Sharing thoughts, stories, and ideas about technology and innovation
          </p>
        </motion.div>

        {/* Articles Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          {articles.length > visibleCount && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6 text-slate-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-6 h-6 text-slate-700" />
              </button>
            </>
          )}

          {/* Articles Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {currentArticles.map((article, index) => {
                if (!article || !article.id) {
                  return null;
                }
                
                return (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <a
                      href={`https://richardiffusion.me/blog/article/${article.id}`}
                      rel="noopener noreferrer"
                      className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      {article.cover_image && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.cover_image}
                            alt={article.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                            <Tag className="w-3 h-3 mr-1" />
                            {article.category}
                          </Badge>
                          {article.reading_time && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {article.reading_time} min
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        {article.subtitle && (
                          <p className="text-gray-600 mb-4 line-clamp-2">{article.subtitle}</p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(article.published_date), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center gap-1 text-indigo-600 font-medium">
                            Read More
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </a>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-indigo-600 scale-125'
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a 
            href="https://richardiffusion.me/blog"
            rel="noopener noreferrer"
          >
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              View All Articles
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}