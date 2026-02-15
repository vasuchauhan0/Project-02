import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${API_URL}/skills?isActive=true`);
      setSkills(response.data.data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categories = ['all', ...Object.keys(groupedSkills)];

  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            My Skills & Expertise
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and proficiency levels
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              {category === 'all' ? 'All Skills' : category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        {skills.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No skills to display yet</p>
          </div>
        ) : selectedCategory === 'all' ? (
          // Display by categories when 'all' is selected
          <div className="space-y-12">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill._id}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        {skill.icon && (
                          <div
                            className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                            style={{ backgroundColor: skill.color }}
                          >
                            {skill.icon}
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{skill.name}</h3>
                          {skill.yearsOfExperience > 0 && (
                            <p className="text-sm text-gray-500">
                              {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} experience
                            </p>
                          )}
                        </div>
                      </div>

                      {skill.description && (
                        <p className="text-gray-600 text-sm mb-4">{skill.description}</p>
                      )}

                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span className="font-medium">Proficiency</span>
                          <span className="font-bold" style={{ color: skill.color }}>
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${skill.proficiency}%`,
                              backgroundColor: skill.color
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Display filtered skills
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <div
                key={skill._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  {skill.icon && (
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                      style={{ backgroundColor: skill.color }}
                    >
                      {skill.icon}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{skill.name}</h3>
                    {skill.yearsOfExperience > 0 && (
                      <p className="text-sm text-gray-500">
                        {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} experience
                      </p>
                    )}
                  </div>
                </div>

                {skill.description && (
                  <p className="text-gray-600 text-sm mb-4">{skill.description}</p>
                )}

                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span className="font-medium">Proficiency</span>
                    <span className="font-bold" style={{ color: skill.color }}>
                      {skill.proficiency}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${skill.proficiency}%`,
                        backgroundColor: skill.color
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
