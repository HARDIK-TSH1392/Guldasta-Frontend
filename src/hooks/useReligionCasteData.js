import { useState, useCallback } from 'react';
import castMapping from '../data/castMap.json';
import muslimCastMapping from '../data/muslimCastMap.json';
import religionOptions from '../data/religions.json';

export const useReligionCasteData = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [casteOptions, setCasteOptions] = useState([]);

  const getCategoriesForReligion = useCallback((religion) => {
    if (religion === "मुस्लिम") {
      return Object.keys(muslimCastMapping);
    } else if (religion && religion !== "other") {
      return Object.keys(castMapping);
    }
    return [];
  }, []);

  const getCastesForCategory = useCallback((religion, category) => {
    if (religion === "मुस्लिम" && category && muslimCastMapping[category]) {
      return muslimCastMapping[category];
    } else if (category && castMapping[category]) {
      return castMapping[category];
    }
    return [];
  }, []);

  const updateCategoriesForReligion = useCallback((religion) => {
    const categories = getCategoriesForReligion(religion);
    setCategoryOptions(categories);
    setCasteOptions([]); // Reset castes when religion changes
  }, [getCategoriesForReligion]);

  const updateCastesForCategory = useCallback((religion, category) => {
    const castes = getCastesForCategory(religion, category);
    setCasteOptions(castes);
  }, [getCastesForCategory]);

  return {
    religionOptions,
    categoryOptions,
    casteOptions,
    updateCategoriesForReligion,
    updateCastesForCategory,
    getCategoriesForReligion,
    getCastesForCategory
  };
};
