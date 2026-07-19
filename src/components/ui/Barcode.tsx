import React from 'react';

const CODE39_PATTERNS: Record<string, string> = {
  '0': 'NNNWWNWNN', '1': 'WNNWNNNNW', '2': 'NNWWNNNNW', '3': 'WNWWNNNNN', '4': 'NNNWNNNWW',
  '5': 'WNNWNNNWN', '6': 'NNWWNNNWN', '7': 'NNNWNNWNW', '8': 'WNNWNNWNN', '9': 'NNWWNNWNN',
  'A': 'WNNNNWNNW', 'B': 'NNWNNWNNW', 'C': 'WNWNNWNNN', 'D': 'NNNNWWNNW', 'E': 'WNNNWWNNN',
  'F': 'NNWNWWNNN', 'G': 'NNNNNWNWW', 'H': 'WNNNNWNWN', 'I': 'NNWNNWNWN', 'J': 'NNNNWWNWN',
  'K': 'WNNNNNNWW', 'L': 'NNWNNNNWW', 'M': 'WNWNNNNWN', 'N': 'NNNNWNNWW', 'O': 'WNNNWNNWN',
  'P': 'NNWNWNNWN', 'Q': 'NNNNNNWWW', 'R': 'WNNNNNWWN', 'S': 'NNWNNNWWN', 'T': 'NNNNWNNWN',
  'U': 'WWNNNNNNW', 'V': 'NWWNNNNNW', 'W': 'WWWNNNNNN', 'X': 'NWNNWNNNW', 'Y': 'WWNNWNNNN',
  'Z': 'NWWNWNNNN', '-': 'NWNNNNWNW', '.': 'WWNNNNWNN', ' ': 'NWWNNNWNN', '*': 'NWNNWNWNN',
  '$': 'NWNWNWNNN', '/': 'NWNWNNNWN', '+': 'NWNNNWNWN', '%': 'NNNWNWNWN',
};

interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
}

export function Barcode({ value, width = 1.3, height = 36 }: BarcodeProps) {
  const sanitizedValue = `*${value.toUpperCase().replace(/[^A-Z0-9\-\.\s\$\/\+\%]/g, '')}*`;
  
  let totalWidth = 0;
  for (let i = 0; i < sanitizedValue.length; i++) {
    const char = sanitizedValue[i];
    const pattern = CODE39_PATTERNS[char] || CODE39_PATTERNS[' '];
    for (let j = 0; j < pattern.length; j++) {
      totalWidth += pattern[j] === 'W' ? 3 : 1;
    }
    if (i < sanitizedValue.length - 1) {
      totalWidth += 1; // Inter-character gap
    }
  }

  const rects: React.ReactNode[] = [];
  let currentX = 0;
  for (let i = 0; i < sanitizedValue.length; i++) {
    const char = sanitizedValue[i];
    const pattern = CODE39_PATTERNS[char] || CODE39_PATTERNS[' '];
    for (let j = 0; j < pattern.length; j++) {
      const isBar = j % 2 === 0;
      const elementWidth = pattern[j] === 'W' ? 3 : 1;
      
      if (isBar) {
        rects.push(
          <rect
            key={`${i}-${j}`}
            x={currentX * width}
            y={0}
            width={elementWidth * width}
            height={height}
            fill="#000000"
          />
        );
      }
      currentX += elementWidth;
    }
    currentX += 1; // Inter-character gap
  }

  return (
    <div className="flex flex-col items-center">
      <svg
        width={totalWidth * width}
        height={height}
        viewBox={`0 0 ${totalWidth * width} ${height}`}
        className="mx-auto"
      >
        {rects}
      </svg>
      <span className="text-[9px] font-mono tracking-[3px] mt-1 text-gray-700">
        {value.toUpperCase()}
      </span>
    </div>
  );
}
