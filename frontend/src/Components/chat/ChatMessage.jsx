import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Import avatar image
import avatarImage from "@/image/avatar.jpg";

export default function ChatMessage({ message, isLatest, isStreaming }) {
  const isUser = message.role === "user";
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 重置显示内容当消息ID改变时
    setDisplayedContent("");
    setCurrentIndex(0);
  }, [message.id]);

  useEffect(() => {
    if (isStreaming && message.content && currentIndex < message.content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(prev => prev + message.content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, isUser ? 0 : 20); // 用户消息立即显示，AI消息逐字显示

      return () => clearTimeout(timer);
    } else if (!isStreaming && displayedContent !== message.content) {
      // 非流式模式下或流式结束时，确保显示完整内容
      setDisplayedContent(message.content);
      setCurrentIndex(message.content.length);
    }
  }, [message.content, currentIndex, isStreaming, isUser, displayedContent]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex gap-4 mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        // Modify here: Assistant message avatar
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg overflow-hidden border-2 border-white">
          <img 
            src={avatarImage} 
            alt="AI Assistant" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className={`max-w-[75%] ${isUser ? "order-first" : ""}`}>
        <div
          className={`rounded-2xl px-5 py-4 shadow-lg ${
            isUser
              ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
              : "bg-white/90 backdrop-blur-sm text-gray-800 border border-gray-100"
          }`}
        >
          <div className="prose prose-sm max-w-none">
            {isUser ? (
              <p className="text-white mb-0">{displayedContent}</p>
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  code: ({ inline, children }) =>
                    inline ? (
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-gray-100 p-3 rounded-lg text-sm font-mono overflow-x-auto">
                        {children}
                      </code>
                    ),
                }}
              >
                {displayedContent}
              </ReactMarkdown>
            )}
          </div>
          {/* 添加打字光标效果 */}
          {isStreaming && isLatest && (
            <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse" />
          )}
        </div>
        {!isUser && message.model && (
          <div className="text-xs text-gray-400 mt-2 ml-1">
            {message.model}
            {isStreaming && " · Typing..."}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-lg">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      )}
    </motion.div>
  );
}