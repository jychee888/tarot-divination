import tarotData from './tarot-data.json';
import imageMapData from './image-map.json';

// 1. 定義從 tarot-data.json 導入的資料結構（純牌義，無圖片）
interface TarotMeaningData {
  id: string;
  name: string;
  type: 'major' | 'minor';
  meanings: {
    [theme: string]: {
      upright: { summary: string; details: string[] };
      reversed: { summary: string; details: string[] };
    };
  };
}

// 2. 定義從 image-map.json 導入的單個物件結構
interface ImageMapItem {
  id: string;
  name: string;
  image: string;
}

// 3. 定義最終導出給前端的完整卡牌結構（包含 image）
export interface TarotCard {
  id: string;
  name: string;
  type: 'major' | 'minor';
  image: string;
  meanings: TarotMeaningData['meanings'];
}

// 4. 建立一個從 id 到 image 路徑的映射，方便快速查找
const imagePathMap: { [id: string]: string } = (imageMapData as ImageMapItem[]).reduce(
  (acc, item) => {
    acc[item.id] = item.image;
    return acc;
  },
  {} as { [id: string]: string }
);

// Debug: Log the first few image paths
console.log('Image path map sample:', Object.entries(imagePathMap).slice(0, 3));

// 5. 合併資料：遍歷牌義資料，並從 imagePathMap 中找到對應的圖片路徑
const tarotCards: TarotCard[] = (tarotData as TarotMeaningData[]).map(card => ({
  ...card,
  // 從 map 中查找圖片路徑，如果找不到則提供一個預設的卡背圖片
  image: imagePathMap[card.id] || '/images/card-back.jpg',
}));

export default tarotCards;
