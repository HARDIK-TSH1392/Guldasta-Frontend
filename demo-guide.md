# Guldasta Application Demo Guide

## Updated Features

### 1. Enhanced Religion-Caste System
- **Religion Options**: हिंदू, मुस्लिम, सिख, ईसाई, बौद्ध, other
- **Dynamic Categories**: Categories change based on selected religion
- **Comprehensive Caste Data**: Detailed caste mapping from ERP frontend
- **Gender Field**: पुरुष (Male), महिला (Female), अन्य (Other)

### 2. Religion-Based Category Mapping

#### For हिंदू and other religions:
- अन्य पिछड़ा वर्ग (OBC)
- अनुसूचित जाति (SC)
- अनुसूचित जनजाति (ST)
- अति पिछड़ा वर्ग (EBC)
- सामान्य वर्ग (General)
- अल्पसंख्यक

#### For मुस्लिम:
- सामान्य
- ओबीसी
- ईबीसी

### 3. Demo Flow

#### Step 1: Start the Application
```bash
# Backend
cd "/Users/hardikstark/Desktop/AICC/Guldasta Backend/Guldasta-Backend"
npm start

# Frontend
cd "/Users/hardikstark/Desktop/AICC/guldasta-frontend"
npm start
```

#### Step 2: User Registration & Profile
1. **Signup**: Enter phone number (e.g., 9876543210)
2. **OTP Verification**: Enter any 4-digit code (demo mode)
3. **Profile Completion**:
   - Name: Test User
   - Gender: पुरुष (Male) / महिला (Female) / अन्य (Other)
   - Role: Volunteer/Leader
   - Religion: Select from dropdown (हिंदू/मुस्लिम/etc.)
   - Category: Auto-populated based on religion
   - Caste: Auto-populated based on category
   - PC/AC/Panchayat: Select from dropdowns

#### Step 3: Beneficiary Registration (Schemes Page)
1. **Beneficiary Details**:
   - Name: राम कुमार
   - Age: 35
   - Gender: पुरुष (Male)
   - Phone: 9876543211
   - Leader Mobile: 9876543212

2. **Religion-Category-Caste Selection**:
   - Religion: हिंदू
   - Category: अन्य पिछड़ा वर्ग (OBC) (auto-populated)
   - Caste: यादव-(ग्वाला, अहीर, गोरा, घासी, मेहर, सदगोप, लक्ष्मी नारायण गोला) (auto-populated)

3. **Scheme Selection**: Select multiple schemes
4. **Submit**: OTP verification for beneficiary

### 4. Key Demo Points

#### Gender Integration:
- **User Profile**: Gender selection with Hindi labels
- **Beneficiary Registration**: Gender field for beneficiaries
- **Database Storage**: Gender stored in both User and Beneficiary models

#### Religion-Based Dynamic Loading:
- **हिंदू Selection**: Shows comprehensive Bihar caste categories
- **मुस्लिम Selection**: Shows Muslim-specific categories (सामान्य, ओबीसी, ईबीसी)
- **Category Selection**: Castes auto-populate based on religion + category

#### Data Accuracy:
- Uses official Bihar caste data from ERP frontend
- Proper Hindi nomenclature
- Hierarchical selection (Religion → Category → Caste)
- Gender options in Hindi with English translations

#### User Experience:
- Disabled fields until prerequisites are selected
- Form validation with proper error messages
- Responsive Bootstrap UI
- Gender validation in both forms

### 5. Test Cases for Demo

#### Test Case 1: Hindu Male User
1. Name: राम कुमार
2. Gender: पुरुष (Male)
3. Religion: हिंदू
4. Category: अनुसूचित जाति (SC)
5. Caste: चमार, मोची

#### Test Case 2: Muslim Female User
1. Name: फातिमा खान
2. Gender: महिला (Female)
3. Religion: मुस्लिम
4. Category: ओबीसी
5. Caste: सुरजापुरी मुस्लिम

#### Test Case 3: General Category Male
1. Name: अमित शर्मा
2. Gender: पुरुष (Male)
3. Religion: हिंदू
4. Category: सामान्य वर्ग (General)
5. Caste: ब्राम्हण

### 6. Backend API Updates
- `/api/reference/religions` - Returns Hindi religion options
- `/api/reference/categories?religion=हिंदू` - Religion-based categories
- `/api/reference/castes?religion=हिंदू&category=अन्य पिछड़ा वर्ग (OBC)` - Dynamic caste loading
- **Gender Support**: All user and beneficiary APIs now support gender field

### 7. Technical Improvements
- **Gender Field**: Added to User and Beneficiary models
- **API Updates**: All auth and beneficiary routes support gender
- **Frontend Forms**: Both Profile and Schemes forms include gender
- **Validation**: Gender validation in both frontend and backend
- **Data Storage**: Gender stored with Hindi labels and English values

## Demo Script

1. **Introduction**: "This is the Guldasta beneficiary management system with enhanced religion-caste data and gender support."

2. **User Registration**: "Let me show you the user registration with proper Hindi data structure including gender selection."

3. **Gender Selection**: "Notice the gender options in Hindi - पुरुष (Male), महिला (Female), अन्य (Other)."

4. **Dynamic Selection**: "Categories change when I select different religions - Hindu shows comprehensive Bihar castes, Muslim shows specific Muslim categories."

5. **Beneficiary Registration**: "Now I'll register a beneficiary showing the same dynamic selection process with gender field."

6. **Data Completeness**: "All forms now capture complete demographic data including gender for better analytics and reporting."

7. **Data Accuracy**: "All caste data matches official Bihar government classifications used in our ERP system."

This updated system now provides comprehensive demographic data collection with proper Hindi nomenclature, Bihar-specific caste data, and gender information for both users and beneficiaries.
