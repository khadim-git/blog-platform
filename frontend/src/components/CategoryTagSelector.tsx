'use client';

import { useState, useEffect } from 'react';
import { getToken } from '../lib/auth';

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Props {
  selectedCategories: number[];
  selectedTags: number[];
  onCategoriesChange: (categories: number[]) => void;
  onTagsChange: (tags: number[]) => void;
}

export default function CategoryTagSelector({ selectedCategories, selectedTags, onCategoriesChange, onTagsChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/categories/');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('http://localhost:8000/tags/');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const createCategory = async () => {
    if (!newCategory.trim()) return;
    
    const token = getToken();
    console.log('Creating category with token:', token ? 'Present' : 'Missing');
    try {
      const response = await fetch('http://localhost:8000/categories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCategory })
      });
      
      console.log('Category creation response:', response.status);
      if (response.ok) {
        fetchCategories();
        setNewCategory('');
        setShowCategoryForm(false);
      } else {
        const errorData = await response.json();
        console.error('Category creation failed:', errorData);
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const createTag = async () => {
    if (!newTag.trim()) return;
    
    const token = getToken();
    console.log('Creating tag with token:', token ? 'Present' : 'Missing');
    try {
      const response = await fetch('http://localhost:8000/tags/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newTag })
      });
      
      console.log('Tag creation response:', response.status);
      if (response.ok) {
        fetchTags();
        setNewTag('');
        setShowTagForm(false);
      } else {
        const errorData = await response.json();
        console.error('Tag creation failed:', errorData);
      }
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Categories</label>
          <button
            type="button"
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Category
          </button>
        </div>
        
        {showCategoryForm && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && createCategory()}
              />
              <button
                type="button"
                onClick={createCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCategoryForm(false)}
                className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onCategoriesChange([...selectedCategories, category.id]);
                  } else {
                    onCategoriesChange(selectedCategories.filter(id => id !== category.id));
                  }
                }}
                className="mr-2"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <button
            type="button"
            onClick={() => setShowTagForm(!showTagForm)}
            className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Tag
          </button>
        </div>
        
        {showTagForm && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter tag name..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyPress={(e) => e.key === 'Enter' && createTag()}
              />
              <button
                type="button"
                onClick={createTag}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowTagForm(false)}
                className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onTagsChange([...selectedTags, tag.id]);
                  } else {
                    onTagsChange(selectedTags.filter(id => id !== tag.id));
                  }
                }}
                className="mr-2"
              />
              <span className="text-sm">{tag.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}