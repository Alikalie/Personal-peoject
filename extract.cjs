const fs = require('fs');
const lines = fs.readFileSync('src/App.jsx', 'utf-8').split(/\r?\n/);

const extract = (start, end, imports, filepath) => {
  const componentContent = lines.slice(start - 1, end).join('\n');
  const match = componentContent.match(/function\s+(\w+)/);
  const name = match ? match[1] : '';
  const finalContent = imports + '\n\n' + componentContent + '\nexport default ' + name + ';\n';
  fs.writeFileSync(filepath, finalContent);
}

extract(198, 449, 'import { useEffect, useState } from "react";\nimport { Link } from "react-router-dom";\nimport { supabase } from "../../lib/supabase";', 'src/pages/public/HomePage.jsx');

extract(451, 602, 'import { useEffect, useState } from "react";\nimport { supabase } from "../../lib/supabase";\nimport { resultStatusClasses } from "../../utils/constants";', 'src/pages/public/PredictionsPage.jsx');

extract(604, 675, 'import React from "react";', 'src/pages/public/VipPage.jsx');

extract(677, 724, 'import { useState } from "react";\n\nconst leagues = [];', 'src/pages/public/LeaguesPage.jsx');

extract(726, 914, 'import { useEffect, useState } from "react";\nimport { supabase } from "../../lib/supabase";', 'src/pages/public/ContactPage.jsx');

console.log('Extraction complete');
