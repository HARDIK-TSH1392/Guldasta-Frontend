import castMapping from '../data/castMap.json';
import muslimCastMapping from '../data/muslimCastMap.json';
import religionOptions from '../data/religions.json';

export { religionOptions };

export const genderOptions = [
  { value: 'male', label: 'पुरुष', labelEn: 'Male' },
  { value: 'female', label: 'महिला', labelEn: 'Female' },
  { value: 'other', label: 'अन्य', labelEn: 'Other' }
];

export const getCategoriesForReligion = (religion) => {
  console.log('Getting categories for religion:', religion);
  if (religion === "मुस्लिम") {
    const categories = Object.keys(muslimCastMapping);
    console.log('Muslim categories:', categories);
    return categories;
  } else if (religion && religion !== "other") {
    const categories = Object.keys(castMapping);
    console.log('Hindu categories:', categories);
    return categories;
  }
  return [];
};

export const getCastesForCategory = (religion, category) => {
  console.log('Getting castes for religion:', religion, 'category:', category);
  if (religion === "मुस्लिम" && category && muslimCastMapping[category]) {
    const castes = muslimCastMapping[category];
    console.log('Muslim castes:', castes);
    return castes;
  } else if (category && castMapping[category]) {
    const castes = castMapping[category];
    console.log('Hindu castes:', castes);
    return castes;
  }
  return [];
};
