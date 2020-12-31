 
const fabric = require('@umijs/fabric');

module.exports = {
  
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "overrides": [
    {
      "files": ".prettierrc",
      "options": { "parser": "json" }
    }
  ],
  ...fabric.prettier,
};