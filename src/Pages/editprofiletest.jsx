
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EditProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        await User.me();
        const profiles = await Profile.list();
        if (profiles.length > 0) {
          setProfile(profiles[0]);
        } else {
          setProfile({
            full_name: '',
            headline: '',
            bio: '',
            current_role: '',
            current_company: '',
            current_status: '',
            location: '',
            email: '',
            phone: '',
            profile_image_url: '',
            skills: [],
            experience: [],
            education: [],
            certifications: [],
            social_links: {}
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        navigate(createPageUrl('Portfolio'));
      }
      setIsLoading(false);
    };
    
    loadProfile();
  }, [navigate]); // Added navigate to dependency array

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (profile.id) {
        await Profile.update(profile.id, profile);
      } else {
        await Profile.create(profile);
      }
      navigate(createPageUrl('Portfolio'));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
    setIsSaving(false);
  };

  const updateField = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const addItem = (field, defaultItem) => {
    setProfile({ ...profile, [field]: [...(profile[field] || []), defaultItem] });
  };

  const updateItem = (field, index, item) => {
    const items = [...profile[field]];
    items[index] = item;
    setProfile({ ...profile, [field]: items });
  };

  const removeItem = (field, index) => {
    setProfile({ ...profile, [field]: profile[field].filter((_, i) => i !== index) });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl('Portfolio'))}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold text-slate-900">Edit Profile</h1>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700"
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
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={profile.full_name || ''}
                    onChange={(e) => updateField('full_name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label>Profile Image URL</Label>
                  <Input
                    value={profile.profile_image_url || ''}
                    onChange={(e) => updateField('profile_image_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <Label>Headline</Label>
                <Input
                  value={profile.headline || ''}
                  onChange={(e) => updateField('headline', e.target.value)}
                  placeholder="Software Engineer & Tech Enthusiast"
                />
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea
                  value={profile.bio || ''}
                  onChange={(e) => updateField('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Current Role</Label>
                  <Input
                    value={profile.current_role || ''}
                    onChange={(e) => updateField('current_role', e.target.value)}
                    placeholder="Senior Developer"
                  />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input
                    value={profile.current_company || ''}
                    onChange={(e) => updateField('current_company', e.target.value)}
                    placeholder="Tech Corp"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Input
                    value={profile.current_status || ''}
                    onChange={(e) => updateField('current_status', e.target.value)}
                    placeholder="Open to opportunities"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Location</Label>
                  <Input
                    value={profile.location || ''}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={profile.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={profile.phone || ''}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>LinkedIn</Label>
                  <Input
                    value={profile.social_links?.linkedin || ''}
                    onChange={(e) => updateField('social_links', { ...profile.social_links, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <Label>GitHub</Label>
                  <Input
                    value={profile.social_links?.github || ''}
                    onChange={(e) => updateField('social_links', { ...profile.social_links, github: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <Label>Twitter</Label>
                  <Input
                    value={profile.social_links?.twitter || ''}
                    onChange={(e) => updateField('social_links', { ...profile.social_links, twitter: e.target.value })}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input
                    value={profile.social_links?.website || ''}
                    onChange={(e) => updateField('social_links', { ...profile.social_links, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('skills', { name: '', level: 'Intermediate', category: '' })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.skills?.map((skill, index) => (
                <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
                  <div className="flex-1 grid md:grid-cols-3 gap-4">
                    <Input
                      value={skill.name || ''}
                      onChange={(e) => updateItem('skills', index, { ...skill, name: e.target.value })}
                      placeholder="Skill name"
                    />
                    <Select
                      value={skill.level || 'Intermediate'}
                      onValueChange={(value) => updateItem('skills', index, { ...skill, level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={skill.category || ''}
                      onChange={(e) => updateItem('skills', index, { ...skill, category: e.target.value })}
                      placeholder="Category (e.g., Programming)"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem('skills', index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Experience</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
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
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.experience?.map((exp, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">Experience #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem('experience', index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      value={exp.title || ''}
                      onChange={(e) => updateItem('experience', index, { ...exp, title: e.target.value })}
                      placeholder="Job Title"
                    />
                    <Input
                      value={exp.company || ''}
                      onChange={(e) => updateItem('experience', index, { ...exp, company: e.target.value })}
                      placeholder="Company"
                    />
                    <Input
                      value={exp.location || ''}
                      onChange={(e) => updateItem('experience', index, { ...exp, location: e.target.value })}
                      placeholder="Location"
                    />
                    <Input
                      value={exp.start_date || ''}
                      onChange={(e) => updateItem('experience', index, { ...exp, start_date: e.target.value })}
                      placeholder="Start Date (e.g., Jan 2020)"
                    />
                    <Input
                      value={exp.end_date || ''}
                      onChange={(e) => updateItem('experience', index, { ...exp, end_date: e.target.value })}
                      placeholder="End Date"
                      disabled={exp.current}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exp.current || false}
                        onChange={(e) => updateItem('experience', index, { ...exp, current: e.target.checked })}
                        className="rounded"
                      />
                      <Label>Currently working here</Label>
                    </div>
                  </div>
                  <Textarea
                    value={exp.description || ''}
                    onChange={(e) => updateItem('experience', index, { ...exp, description: e.target.value })}
                    placeholder="Job description"
                    rows={3}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Education</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('education', { degree: '', field: '', institution: '', year: '', description: '' })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.education?.map((edu, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">Education #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem('education', index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      value={edu.degree || ''}
                      onChange={(e) => updateItem('education', index, { ...edu, degree: e.target.value })}
                      placeholder="Degree (e.g., Bachelor's)"
                    />
                    <Input
                      value={edu.field || ''}
                      onChange={(e) => updateItem('education', index, { ...edu, field: e.target.value })}
                      placeholder="Field of Study"
                    />
                    <Input
                      value={edu.institution || ''}
                      onChange={(e) => updateItem('education', index, { ...edu, institution: e.target.value })}
                      placeholder="Institution"
                    />
                    <Input
                      value={edu.year || ''}
                      onChange={(e) => updateItem('education', index, { ...edu, year: e.target.value })}
                      placeholder="Year (e.g., 2015-2019)"
                    />
                  </div>
                  <Textarea
                    value={edu.description || ''}
                    onChange={(e) => updateItem('education', index, { ...edu, description: e.target.value })}
                    placeholder="Description"
                    rows={2}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Certifications</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addItem('certifications', { name: '', issuer: '', date: '' })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.certifications?.map((cert, index) => (
                <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
                  <div className="flex-1 grid md:grid-cols-3 gap-4">
                    <Input
                      value={cert.name || ''}
                      onChange={(e) => updateItem('certifications', index, { ...cert, name: e.target.value })}
                      placeholder="Certification Name"
                    />
                    <Input
                      value={cert.issuer || ''}
                      onChange={(e) => updateItem('certifications', index, { ...cert, issuer: e.target.value })}
                      placeholder="Issuing Organization"
                    />
                    <Input
                      value={cert.date || ''}
                      onChange={(e) => updateItem('certifications', index, { ...cert, date: e.target.value })}
                      placeholder="Date (e.g., Jan 2023)"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem('certifications', index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700"
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
