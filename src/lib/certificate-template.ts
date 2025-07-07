interface CertificateData {
    studentName: string;
    courseTitle: string;
    completionDate: string;
}

export const generateCertificateSVG = ({ studentName, courseTitle, completionDate }: CertificateData): string => {
    const svgContent = `
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" style="background-color: #0E1116; font-family: 'Space Grotesk', sans-serif;">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Dancing+Script:wght@700&display=swap');
    </style>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#772CE8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9FEF00;stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect x="20" y="20" width="760" height="560" fill="none" stroke="#772CE8" stroke-width="3" rx="10" />
  <rect x="25" y="25" width="750" height="550" fill="none" stroke="#9FEF00" stroke-width="1" rx="8" />

  <text x="400" y="90" font-family="'Space Grotesk', sans-serif" font-size="36" font-weight="bold" fill="#E5E7EB" text-anchor="middle">
    FullStack<tspan fill="#772CE8">Edge</tspan>
  </text>
  
  <text x="400" y="160" font-family="'Space Grotesk', sans-serif" font-size="28" fill="#9FEF00" text-anchor="middle" letter-spacing="2">
    CERTIFICATE OF COMPLETION
  </text>
  
  <line x1="100" y1="180" x2="700" y2="180" stroke="url(#grad1)" stroke-width="2"/>

  <text x="400" y="240" font-family="'Inter', sans-serif" font-size="18" fill="#D1D5DB" text-anchor="middle">
    This certificate is proudly presented to
  </text>
  
  <text x="400" y="320" font-family="'Dancing Script', cursive" font-size="52" fill="#FFFFFF" text-anchor="middle" font-weight="bold">
    ${studentName}
  </text>
  <line x1="200" y1="340" x2="600" y2="340" stroke="#772CE8" stroke-width="1.5"/>
  
  <text x="400" y="390" font-family="'Inter', sans-serif" font-size="18" fill="#D1D5DB" text-anchor="middle">
    For successfully completing the course
  </text>
  <text x="400" y="430" font-family="'Space Grotesk', sans-serif" font-size="24" fill="#9FEF00" text-anchor="middle" font-weight="bold">
    ${courseTitle}
  </text>

  <g transform="translate(100, 500)">
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="14" fill="#D1D5DB">Date of Completion</text>
    <text x="0" y="25" font-family="'Space Grotesk', sans-serif" font-size="16" fill="#FFFFFF">${completionDate}</text>
    <line x1="0" y1="35" x2="200" y2="35" stroke="#9FEF00" stroke-width="1"/>
  </g>
  
  <g transform="translate(500, 500)">
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="14" fill="#D1D5DB">Instructor Signature</text>
    <text x="0" y="25" font-family="'Dancing Script', cursive" font-size="22" fill="#FFFFFF">Your Signature</text>
    <line x1="0" y1="35" x2="200" y2="35" stroke="#772CE8" stroke-width="1"/>
  </g>
</svg>
`;
    return svgContent;
};
