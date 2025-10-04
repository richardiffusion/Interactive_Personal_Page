import React, { useState, useEffect } from 'react';
import { Profile } from '@/entities/Profile';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// 简单的选择组件替代
const SimpleSelect = ({ value, onChange, options, className = '' }) => {
  return (
    <select 
      value={value} 
      onChange={onChange}
      className={`flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default function EditProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    full_name: '',
    headline: '',
    bio: '',
    current_role: '',
    current_company: '',
    current_status: 'Currently employed',
    location: '',
    email: '',
    phone: '',
    profile_image_url: '',
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    social_links: {
      linkedin: '',
      github: '',
      twitter: '',
      website: ''
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const statusOptions = [
    { value: 'Open to opportunities', label: 'Open to opportunities' },
    { value: 'Currently employed', label: 'Currently employed' },
    { value: 'Looking for work', label: 'Looking for work' },
    { value: 'Freelance', label: 'Freelance' }
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      console.log('Current user:', user);
      
      const profiles = await Profile.list();
      console.log('Loaded profiles:', profiles);
      
      if (profiles.length > 0) {
        console.log('Setting existing profile:', profiles[0]);
        setProfile(profiles[0]);
      } else {
        console.log('No existing profile, using default');
        // 使用默认空状态，不需要设置
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('Saving profile:', profile);
      await Profile.save(profile);
      console.log('Profile saved successfully');
      alert('Profile saved successfully!');
      navigate(createPageUrl('Portfolio'));
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Check console for details.');
    }
    setIsSaving(false);
  };

  const updateField = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const updateSocialLink = (platform, value) => {
    setProfile(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  const addItem = (field, defaultItem) => {
    setProfile(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultItem]
    }));
  };

  const updateItem = (field, index, updatedItem) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? updatedItem : item)
    }));
  };

  const removeItem = (field, index) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addAchievement = (expIndex, achievement) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex 
          ? { ...exp, achievements: [...(exp.achievements || []), achievement] }
          : exp
      )
    }));
  };

  const updateAchievement = (expIndex, achievementIndex, achievement) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex 
          ? { 
              ...exp, 
              achievements: (exp.achievements || []).map((a, j) => 
                j === achievementIndex ? achievement : a
              )
            }
          : exp
      )
    }));
  };

  const removeAchievement = (expIndex, achievementIndex) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex 
          ? { 
              ...exp, 
              achievements: (exp.achievements || []).filter((_, j) => j !== achievementIndex)
            }
          : exp
      )
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl('Portfolio'))}
              className="rounded-xl border-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Edit Profile</h1>
              <p className="text-slate-600 mt-1">Update your professional information</p>
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Profile
          </Button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Full Name *</Label>
                  <Input
                    value={profile.full_name}
                    onChange={(e) => updateField('full_name', e.target.value)}
                    placeholder="John Doe"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Profile Image URL</Label>
                  <Input
                    value={profile.profile_image_url}
                    onChange={(e) => updateField('profile_image_url', e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Professional Headline</Label>
                <Input
                  value={profile.headline}
                  onChange={(e) => updateField('headline', e.target.value)}
                  placeholder="Senior Software Engineer & Tech Lead"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Bio</Label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  placeholder="Tell your professional story..."
                  rows={4}
                  className="rounded-xl"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Current Role</Label>
                  <Input
                    value={profile.current_role}
                    onChange={(e) => updateField('current_role', e.target.value)}
                    placeholder="Senior Developer"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Company</Label>
                  <Input
                    value={profile.current_company}
                    onChange={(e) => updateField('current_company', e.target.value)}
                    placeholder="Tech Company Inc."
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Status</Label>
                  <SimpleSelect
                    value={profile.current_status}
                    onChange={(e) => updateField('current_status', e.target.value)}
                    options={statusOptions}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Location</Label>
                  <Input
                    value={profile.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="San Francisco, CA"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Email *</Label>
                  <Input
                    value={profile.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="john.doe@example.com"
                    type="email"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Phone</Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Social Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">LinkedIn</Label>
                  <Input
                    value={profile.social_links.linkedin || ''}
                    onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">GitHub</Label>
                  <Input
                    value={profile.social_links.github || ''}
                    onChange={(e) => updateSocialLink('github', e.target.value)}
                    placeholder="https://github.com/username"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Twitter</Label>
                  <Input
                    value={profile.social_links.twitter || ''}
                    onChange={(e) => updateSocialLink('twitter', e.target.value)}
                    placeholder="https://twitter.com/username"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Personal Website</Label>
                  <Input
                    value={profile.social_links.website || ''}
                    onChange={(e) => updateSocialLink('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Skills</CardTitle>
              <Button
                variant="outline"
                onClick={() => addItem('skills', { name: '', level: 'Intermediate', category: '' })}
                className="rounded-xl border-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.skills.map((skill, index) => (
                <div key={index} className="flex gap-4 items-start p-4 border-2 border-gray-100 rounded-xl bg-white">
                  <div className="flex-1 grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Skill Name</Label>
                      <Input
                        value={skill.name}
                        onChange={(e) => updateItem('skills', index, { ...skill, name: e.target.value })}
                        placeholder="JavaScript"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Level</Label>
                      <SimpleSelect
                        value={skill.level}
                        onChange={(e) => updateItem('skills', index, { ...skill, level: e.target.value })}
                        options={[
                          { value: 'Beginner', label: 'Beginner' },
                          { value: 'Intermediate', label: 'Intermediate' },
                          { value: 'Advanced', label: 'Advanced' },
                          { value: 'Expert', label: 'Expert' }
                        ]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Category</Label>
                      <Input
                        value={skill.category}
                        onChange={(e) => updateItem('skills', index, { ...skill, category: e.target.value })}
                        placeholder="Programming Languages"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem('skills', index)}
                    className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 mt-6"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {profile.skills.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p>No skills added yet. Click "Add Skill" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Work Experience</CardTitle>
              <Button
                variant="outline"
                onClick={() => addItem('experience', { 
                  title: '', 
                  company: '', 
                  location: '', 
                  start_date: '', 
                  end_date: '', 
                  current: false,
                  description: '',
                  achievements: []
                })}
                className="rounded-xl border-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.experience.map((exp, index) => (
                <div key={index} className="p-6 border-2 border-gray-100 rounded-xl bg-white space-y-6">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-lg text-slate-900">Experience #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem('experience', index)}
                      className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Job Title *</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) => updateItem('experience', index, { ...exp, title: e.target.value })}
                        placeholder="Senior Software Engineer"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Company *</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateItem('experience', index, { ...exp, company: e.target.value })}
                        placeholder="Tech Company Inc."
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Location</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateItem('experience', index, { ...exp, location: e.target.value })}
                        placeholder="San Francisco, CA"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Start Date</Label>
                      <Input
                        value={exp.start_date}
                        onChange={(e) => updateItem('experience', index, { ...exp, start_date: e.target.value })}
                        placeholder="Jan 2020"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">End Date</Label>
                      <Input
                        value={exp.end_date}
                        onChange={(e) => updateItem('experience', index, { ...exp, end_date: e.target.value })}
                        placeholder="Present"
                        disabled={exp.current}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2 flex items-center gap-3 pt-6">
                      <input
                        type="checkbox"
                        checked={exp.current || false}
                        onChange={(e) => updateItem('experience', index, { ...exp, current: e.target.checked })}
                        className="rounded w-4 h-4"
                      />
                      <Label className="text-sm font-semibold">I currently work here</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Description</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateItem('experience', index, { ...exp, description: e.target.value })}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={3}
                      className="rounded-xl"
                    />
                  </div>

                  {/* Achievements */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Key Achievements</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addAchievement(index, '')}
                        className="rounded-xl border-2"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Achievement
                      </Button>
                    </div>
                    {(exp.achievements || []).map((achievement, achievementIndex) => (
                      <div key={achievementIndex} className="flex gap-3 items-center">
                        <Input
                          value={achievement}
                          onChange={(e) => updateAchievement(index, achievementIndex, e.target.value)}
                          placeholder="Describe a key achievement..."
                          className="rounded-xl flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAchievement(index, achievementIndex)}
                          className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {profile.experience.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p>No experience added yet. Click "Add Experience" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Education</CardTitle>
              <Button
                variant="outline"
                onClick={() => addItem('education', { degree: '', field: '', institution: '', year: '', description: '' })}
                className="rounded-xl border-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.education.map((edu, index) => (
                <div key={index} className="p-6 border-2 border-gray-100 rounded-xl bg-white space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-lg text-slate-900">Education #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem('education', index)}
                      className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateItem('education', index, { ...edu, degree: e.target.value })}
                        placeholder="Bachelor of Science"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Field of Study</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) => updateItem('education', index, { ...edu, field: e.target.value })}
                        placeholder="Computer Science"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateItem('education', index, { ...edu, institution: e.target.value })}
                        placeholder="University of Technology"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Year</Label>
                      <Input
                        value={edu.year}
                        onChange={(e) => updateItem('education', index, { ...edu, year: e.target.value })}
                        placeholder="2015-2019"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Description</Label>
                    <Textarea
                      value={edu.description}
                      onChange={(e) => updateItem('education', index, { ...edu, description: e.target.value })}
                      placeholder="Additional information about your education..."
                      rows={2}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              ))}
              {profile.education.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p>No education added yet. Click "Add Education" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Certifications</CardTitle>
              <Button
                variant="outline"
                onClick={() => addItem('certifications', { name: '', issuer: '', date: '' })}
                className="rounded-xl border-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.certifications.map((cert, index) => (
                <div key={index} className="flex gap-4 items-start p-4 border-2 border-gray-100 rounded-xl bg-white">
                  <div className="flex-1 grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Certification Name</Label>
                      <Input
                        value={cert.name}
                        onChange={(e) => updateItem('certifications', index, { ...cert, name: e.target.value })}
                        placeholder="AWS Certified Solutions Architect"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Issuing Organization</Label>
                      <Input
                        value={cert.issuer}
                        onChange={(e) => updateItem('certifications', index, { ...cert, issuer: e.target.value })}
                        placeholder="Amazon Web Services"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Date</Label>
                      <Input
                        value={cert.date}
                        onChange={(e) => updateItem('certifications', index, { ...cert, date: e.target.value })}
                        placeholder="Jun 2023"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem('certifications', index)}
                    className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 mt-6"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {profile.certifications.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p>No certifications added yet. Click "Add Certification" to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg rounded-xl"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}