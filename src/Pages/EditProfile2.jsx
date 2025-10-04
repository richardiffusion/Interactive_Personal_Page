import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Profile } from '@/entities/Profile';
import { Link } from 'react-router-dom';

// 简单的 select 组件
const SimpleSelect = ({ value, onChange, options, className = '' }) => {
  return (
    <select 
      value={value} 
      onChange={onChange}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
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
    try {
      const profiles = await Profile.list();
      console.log('Loaded profiles in EditProfile:', profiles); // 添加日志
      if (profiles.length > 0) {
        setProfile(profiles[0]);
      } else {
        // 如果没有数据，预填充一些示例数据
        setProfile({
          full_name: '李逸群',
          headline: 'AI开发工程师',
          bio: '拥有5年经验的软件工程师，专注于React和Node.js开发。',
          current_role: '高级软件工程师',
          current_company: '香港科技公司',
          current_status: 'Currently employed',
          location: '香港，深圳',
          email: 'richard.yiqun.li@outlook.com',
          phone: '+86 18565818176',
          skills: [
            { name: 'JavaScript', level: 'Expert', category: '编程语言' },
            { name: 'Python', level: 'Expert', category: '编程语言' },
            { name: 'React', level: 'Expert', category: '前端框架' },
          ],
          
          experience: [
            {
              title: '高级软件工程师',
              company: '科技公司',
              location: '深圳',
              start_date: '2023-04-01',
              end_date: 'Current',
              current: true,
              description: '负责前端架构设计和开发',
              achievements: [
                '领导团队完成大型项目开发',
                '优化应用性能，提升30%加载速度'
              ]
            }
          ],
          education: [
            {
              degree: '信息科学硕士',
              field: '信息科学',
              institution: '纽约理工大学',
              year: '2017',
              description: '主修软件工程、数据结构与算法'
            }
          ],
          certifications: [
            {
              name: 'AWS认证解决方案架构师',
              issuer: 'Amazon Web Services',
              date: '2021-06-01'
            }
          ],
          social_links: {
            linkedin: 'https://linkedin.com/',
            github: 'https://github.com/',
            twitter: '',
            website: 'https://richardiffusion.com'
          }
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    try {
      await Profile.save(profile);
      alert('个人资料保存成功！');
      // 保存后跳转回主页
      window.location.href = '/';
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('保存个人资料时出错');
    }
  };

  const addSkill = () => {
    const newSkill = { name: '', level: 'Intermediate', category: '' };
    setProfile({
      ...profile,
      skills: [...profile.skills, newSkill]
    });
  };

  const updateSkill = (index, field, value) => {
    const updatedSkills = [...profile.skills];
    updatedSkills[index][field] = value;
    setProfile({ ...profile, skills: updatedSkills });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">编辑个人资料</h1>
        <Link to="/">
          <Button variant="outline">返回主页</Button>
        </Link>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">姓名</Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) => setProfile({...profile, full_name: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="headline">职位头衔</Label>
              <Input
                id="headline"
                value={profile.headline}
                onChange={(e) => setProfile({...profile, headline: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_role">当前职位</Label>
              <Input
                id="current_role"
                value={profile.current_role}
                onChange={(e) => setProfile({...profile, current_role: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="current_company">当前公司</Label>
              <Input
                id="current_company"
                value={profile.current_company}
                onChange={(e) => setProfile({...profile, current_company: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="current_status">当前状态</Label>
            <SimpleSelect
              value={profile.current_status}
              onChange={(e) => setProfile({...profile, current_status: e.target.value})}
              options={statusOptions}
            />
          </div>
          
          <div>
            <Label htmlFor="bio">个人简介</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>技能</CardTitle>
        </CardHeader>
        <CardContent>
          {profile.skills.map((skill, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <Input
                placeholder="技能名称"
                value={skill.name}
                onChange={(e) => updateSkill(index, 'name', e.target.value)}
              />
              <SimpleSelect
                value={skill.level}
                onChange={(e) => updateSkill(index, 'level', e.target.value)}
                options={[
                  { value: 'Beginner', label: '初级' },
                  { value: 'Intermediate', label: '中级' },
                  { value: 'Advanced', label: '高级' },
                  { value: 'Expert', label: '专家' }
                ]}
              />
              <Input
                placeholder="分类"
                value={skill.category}
                onChange={(e) => updateSkill(index, 'category', e.target.value)}
              />
            </div>
          ))}
          <Button onClick={addSkill} variant="outline">添加技能</Button>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Link to="/">
          <Button variant="outline">取消</Button>
        </Link>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          保存个人资料
        </Button>
      </div>
    </div>
  );
}



