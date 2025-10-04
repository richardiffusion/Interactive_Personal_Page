import React, { useState, useEffect } from 'react';
import { Profile } from '@/entities/Profile';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Pencil, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import HeroSection from '../Components/portfolio/HeroSection.jsx';
import ExperienceSection from '../Components/portfolio/ExperienceSection.jsx';
import SkillsSection from '../Components/portfolio/SkillsSection.jsx';
import EducationSection from '../Components/portfolio/EducationSection.jsx';

export default function Portfolio() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const profiles = await Profile.list();
      console.log('Loaded profiles in Portfolio:', profiles); // 添加详细日志
      
      if (profiles.length > 0) {
        console.log('Setting profile:', profiles[0]); // 添加日志
        setProfile(profiles[0]);
      } else {
        console.log('No profiles found'); // 添加日志
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
    setIsLoading(false);
  };

  console.log('Current state in Portfolio:', { isLoading, profile, currentUser });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Pencil className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Create Your Portfolio
          </h2>
          <p className="text-slate-600 mb-8">
            Get started by creating your professional portfolio profile. 
            Add your experience, skills, and education to showcase your expertise.
          </p>
          <Link to={createPageUrl('EditProfile')}>
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              <Pencil className="w-4 h-4 mr-2" />
              Create Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Edit button for authenticated users */}
      {currentUser && (
        <div className="fixed top-6 right-6 z-50">
          <Link to={createPageUrl('EditProfile')}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg">
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>
      )}

      <HeroSection profile={profile} />
      <ExperienceSection experience={profile.experience} />
      <SkillsSection skills={profile.skills} />
      <EducationSection 
        education={profile.education} 
        certifications={profile.certifications} 
      />

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400">
            © {new Date().getFullYear()} {profile.full_name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
