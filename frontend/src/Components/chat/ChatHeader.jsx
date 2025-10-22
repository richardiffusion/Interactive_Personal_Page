import React from "react";
import { Sparkles, MessageSquare, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const AI_MODELS = {
  deepseek: "DeepSeek Reasoning",
  creative: "Creative Writer", 
  technical: "Technical Expert",
  general: "General Assistant",
};

export default function ChatHeader({ selectedModel, onNewChat, onBackToHome, messageCount }) {
  return (
    <div className="border-b border-gray-200 bg-white/90 backdrop-blur-lg px-6 py-4 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Back to Homepage */}
          <Button
            variant="outline"
            onClick={onBackToHome}
            className="gap-2 hover:bg-gray-50"
            title="Back to Homepage"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Button>
          
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Chatbox
            </h1>
            <p className="text-sm text-gray-500">
              {AI_MODELS[selectedModel] || "Select a model"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {messageCount > 0 && (
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <MessageSquare className="w-4 h-4" />
              <span>{messageCount} New messages </span>
            </div>
          )}
          <Button
            variant="outline"
            onClick={onNewChat}
            className="gap-2 hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </div>
      </div>
    </div>
  );
}