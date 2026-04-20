import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContentLanguageService {

  constructor() { }

  getAllContentLanguages(content: any) {
    const masterLanguagesArray = [
      { name: "English", value: "English" },
      { name: "ಕನ್ನಡ (Kannada)", value: "Kannada" },
      { name: "తెలుగు (Telugu)", value: "Telugu" },
      { name: "தமிழ் (Tamil)", value: "Tamil" },
      { name: "മലയാളം (Malayalam)", value: "Malayalam" },
      { name: "हिंदी (Hindi)", value: "Hindi" },
      { name: "অসমীয়া (Assamese)", value: "Assamese" },
      { name: "বাংলা (Bengali)", value: "Bengali" },
      { name: "ગુજરાતી (Gujarati)", value: "Gujarati" },
      { name: "मराठी (Marathi)", value: "Marathi" },
      { name: "ଓଡିଆ (Odia)", value: "Odia" },
      { name: "ਪੰਜਾਬੀ (Punjabi)", value: "Punjabi" },
      { name: "कोंकणी (Konkani)", value: "Konkani" },
      { name: "बड़ो (Bodo)", value: "Bodo" },
      { name: "डोगरी (Dogri)", value: "Dogri" },
      { name: "كشميري / कश्मीरी (Kashmiri)", value: "Kashmiri" },
      { name: "मैथिली (Maithili)", value: "Maithili" },
      { name: "মৈতৈলোন্  (Manipuri )", value: "Manipuri" },
      { name: "नेपाली (Nepali)", value: "Nepali" },
      { name: "संस्कृतम् (Sanskrit)", value: "Sanskrit" },
      { name: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)", value: "Santali" },
      { name: "سنڌي / सिंधी (Sindhi)", value: "Sindhi" },
      { name: "اُردُو (Urdu)", value: "Urdu" }
    ];
    
    // Convert array to map for efficient lookup by language value
    const masterLanguages = new Map();
    
    // Extract local value (name without brackets) and populate map
    masterLanguagesArray.forEach(lang => {
      const localValue = lang.name.split('(')[0].trim();
      masterLanguages.set(lang.value.toLowerCase(), {
        ...lang,
        localValue
      });
    });
    
    let output = [];
    
    // Case 1: When languageMapV1 is available
    if (content && content.languageMapV1 && Object.keys(content.languageMapV1).length > 0) {
      // Iterate over each language in languageMapV1
      for (const langKey of Object.keys(content.languageMapV1)) {
        const langData = content.languageMapV1[langKey];
        // Find matching master language
       if(langData && langData.status && langData.status.toLowerCase() === 'live') {
        const masterLang = masterLanguages.get(langKey.toLowerCase());
        
        if (masterLang) {
          output.push({
            name: masterLang.name,
            value: masterLang.value,
            localValue: masterLang.localValue,
            langId: langKey.toLowerCase(),
            isBaseLang: langData?.isBaseLang,
            identifier: langData.id,
            status: langData.status
          });
        }
       }
      }
    } 
    // Case 2: When languageMapV1 is not available, use language array
    else if (content && content.language && content.language.length > 0) {
      for (const lang of content.language) {
        const masterLang = masterLanguages.get(lang.toLowerCase());
        
        if (masterLang) {
          output.push({
            name: masterLang.name,
            value: masterLang.value,
            localValue: masterLang.localValue,
            langId: lang.toLowerCase(),
            isBaseLang: true, // Assuming the first language is base language
            identifier: content.identifier, // Use the content identifier
            status: content.status || 'Live'
          });
        }
      }
    }
    return output;
  }

  getBaseLanguage(content: any) {
    let langList = this.getAllContentLanguages(content);
    if (langList && langList.length > 0) {
      // Find the first language that is marked as base language
      const selectedLanguage = langList.find(lang => lang?.isBaseLang);
      return selectedLanguage 
    }
  }
  
  getSelectedLanguage(content: any) {
    let langList = this.getAllContentLanguages(content);
    if (langList && langList.length > 0) {
      // Find the first language that is marked as base language
      const selectedLanguage = langList.find(lang => lang.identifier === content?.identifier);
      return selectedLanguage 
    }
  }

  getRequiredLanguageDetails(content: any, langId: string) {
    let langList = this.getAllContentLanguages(content);
    if (langList && langList.length > 0) {
      // Find the first language that is marked as base language
      const selectedLanguage = langList.find(lang => lang.langId === langId);
      return selectedLanguage 
    }
  }

  getContentLanguage(content: any){
    if(content && content?.language && content?.language.length > 0){ 
      return content.language[0].toLowerCase()
    }
  }
}