import React, { useState, useEffect } from 'react';
import { GenerateImage } from '@/api/integrations';

export const generateModuleImages = async () => {
  const prompts = {
    democracy_basics: "Modern flat illustration of government buildings with geometric shapes, clean lines, blue and gold color scheme, minimalist design, no text",
    voting: "Flat design illustration of ballot boxes and voting symbols, geometric style, purple and teal colors, simple icons, modern graphic design",
    local_government: "Clean geometric illustration of community buildings, parks and local services, green and blue color palette, flat design style",
    rights_responsibilities: "Modern flat illustration of scales of justice and people icons, geometric design, orange and red color scheme, minimalist style",
    civic_participation: "Flat design illustration of people connecting and community engagement, geometric style, coral and pink colors, modern graphic design"
  };
  
  const results = {};
  
  for (const [category, prompt] of Object.entries(prompts)) {
    try {
      const response = await GenerateImage({ prompt });
      results[category] = response.url;
    } catch (error) {
      console.error(`Error generating image for ${category}:`, error);
    }
  }
  
  return results;
};