// 20251013新增一项
import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Linkedin, Github, Twitter, MessageSquare, Globe, Download, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// 20251013新增
import { Input } from '@/components/ui/input';

// 20251015新增，路由导航
import { useNavigate } from 'react-router-dom';



export default function HeroSection({ profile }) {
  if (!profile) return null;

  // 20251015修改内容
  const navigate = useNavigate();
  const [chatMessage, setChatMessage] = useState('');


  // 处理聊天消息发送 - 使用 sessionStorage 传递消息
  const handleChatSend = () => {
    if (!chatMessage.trim()) return;

    // 将消息存储到 sessionStorage，聊天页面会自动读取
    sessionStorage.setItem('autoSendMessage', chatMessage);
    
    // 使用 React Router 导航到聊天页面
    navigate('/chat');
  };

  // 处理输入框回车键
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleChatSend();
    }
  };
  // 修改内容止


  const socialLinks = [
    { icon: Linkedin, url: profile.social_links?.linkedin, label: 'LinkedIn' },
    { icon: Github, url: profile.social_links?.github, label: 'GitHub' },
    { icon: Twitter, url: profile.social_links?.twitter, label: 'X' },
    { icon: Globe, url: profile.social_links?.website, label: 'Website' },
  ].filter(link => link.url);
 
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Profile Image */}
            {profile.profile_image_url && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8 flex justify-center"
              >
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                    <img 
                      src={profile.profile_image_url} 
                      alt={profile.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white" />
                </div>
              </motion.div>
            )}

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight"
            >
              {profile.full_name}
            </motion.h1>

            {/* Headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl md:text-3xl text-slate-600 mb-4 font-light"
            >
              {profile.headline}
            </motion.p>

            {/* Current Role & Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-3 mb-8"
            >
              {profile.current_role && (
                <Badge variant="secondary" className="px-4 py-2 text-base bg-indigo-100 text-indigo-800 border-indigo-200">
                  {profile.current_role} {profile.current_company && `@ ${profile.current_company}`}
                </Badge>
              )}

              {profile.current_status && ( //20251015修改：增加不同情况的矩形颜色
                <Badge 
                  className={`px-4 py-2 text-base border text-white ${
                    profile.current_status === 'Open to opportunities' 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-700'
                      : profile.current_status === 'Looking for work' 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-700' 
                      : profile.current_status === 'Freelance' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-700'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 border-gray-700' // Currently employed
                  }`}
                >
                  {profile.current_status}
                </Badge>
              )}

              {profile.location && (
                <div className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
            </motion.div>

            {/* Bio */}
            {profile.bio && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed"
              >
                {profile.bio}
              </motion.p>
            )}


            {/* Chat with AI Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mb-10"
            >
              <div className="max-w-md mx-auto">
                <p className="text-slate-600 mb-4 text-lg font-medium">
                  {/* First Row Word Enter Here + */}
                </p>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter your questions..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <Button 
                    onClick={handleChatSend}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                    disabled={!chatMessage.trim()}
                  >

                    <Send className="w-4 h-4" />
                    Chat with Me
                  </Button>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {/* 点击按钮开始与我的 AI 助手对话 + 添加明文*/}
                  AI Chatbox - Ask Me Anything
                </p>
              </div>
            </motion.div>


            {/* Contact & Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              {profile.email && (
                <a href={`mailto:${profile.email}`}>
                  <Button variant="outline" className="gap-2">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </Button>
                </a>
              )}
              {profile.phone && (
                <a href={`tel:${profile.phone}`}>
                  <Button variant="outline" className="gap-2">
                    <Phone className="w-4 h-4" />
                    {profile.phone}
                  </Button>
                </a>
              )}
            </motion.div>

            

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex items-center justify-center gap-3 mt-6"
              >
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 shadow-sm hover:shadow-md"
                    aria-label={link.label}
                  >
                    <link.icon className="w-5 h-5 text-slate-600" />
                  </a>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}