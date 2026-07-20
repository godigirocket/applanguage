// Script para adicionar landmarkImage em todas as cidades
const fs = require('fs');
const path = require('path');

const landmarkEmojis = {
  'ny': '🗽', // Statue of Liberty
  'boston': '🏛️', // Historic buildings
  'miami': '🏖️', // Beach
  'lon': '🏰', // Tower/Palace
  'sco': '🏴', // Scotland flag
  'mad': '🏛️', // Royal Palace
  'and': '🕌', // Alhambra
  'cdmx': '🏛️', // Aztec ruins
  'ba': '🎭', // Tango
  'bog': '⛰️', // Mountains
  'sp': '🏛️', // MASP
  'rio': '🗿', // Christ the Redeemer
  'lis': '🏰', // Castle
  'tor': '🗼', // CN Tower
  'van': '🏔️', // Mountains
  'syd': '🎭', // Opera House
  'mel': '🏙️', // City
  'par': '🗼', // Eiffel Tower
  'ber': '🚪', // Brandenburg Gate
  'rom': '🏛️', // Colosseum
  'tok': '🗼', // Tokyo Tower
  'bei': '🏯', // Forbidden City
  'del': '🕌', // Taj Mahal area
  'cpt': '⛰️', // Table Mountain
};

const filePath = path.join(__dirname, '..', 'src', 'lib', 'cultureData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Para cada cidade, adicionar landmarkImage se não existir
Object.entries(landmarkEmojis).forEach(([cityId, emoji]) => {
  // Procurar padrão: id: "cityId",
  const pattern = new RegExp(`(id: "${cityId}",\\s+name:)`, 'g');
  
  // Verificar se já tem landmarkImage
  const cityBlockPattern = new RegExp(`id: "${cityId}",[\\s\\S]*?landmarkImage:`, 'g');
  
  if (!cityBlockPattern.test(content)) {
    // Adicionar landmarkImage após coords
    const coordsPattern = new RegExp(
      `(id: "${cityId}",\\s+name:[\\s\\S]*?coords: \\{[^}]+\\},)`,
      'g'
    );
    
    content = content.replace(coordsPattern, `$1\n        landmarkImage: "${emoji}",`);
  }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Landmarks adicionados com sucesso!');
console.log(`📍 ${Object.keys(landmarkEmojis).length} cidades atualizadas`);
