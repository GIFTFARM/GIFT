import { Address, TonClient } from '@ton/ton';
import { config } from '../config';

// Список поддерживаемых коллекций NFT
export const SUPPORTED_COLLECTIONS = [
  'EQC6zjid8vJNEWqcXk10XjsdDLRKbcPZzbHusuEW6FokOWIm',
  'EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl',
  'EQBMcfMAZlMUr1W3X8kdEw3fJMUAaWH4-XcmE5R5RfFIY0E2',
  'EQDQ6DjRabTYSAxf2xrZsnsXtqcIm1bj9dF5x_h8lNjWPmH4',
  'EQCefrjhCD2_7HRIr2lmwt9ZaqeG_tdseBvADC66833kBS3y',
  'EQBD8aBKC4NsnYMqtkCfPQk2EVnieynJQp1UgZVyx1VmR5Ml',
  'EQCBK_JBASAA5XVz1D17Pn--kQaMWm0b9wReVtsEdRO4Tgy9',
  'EQAwzubeoJwnqmmBuTPpnUSurRzWPB8ERzcfzx55Z2YjE0jx',
  'EQCwEFfUbbR-22fn3VgxUpBil7bwBQqEHm7wgQYbWY9c08YJ',
  'EQAaTIR7oJyowDiumYLVN0oe61kGE3I6EPEn7WgHPGuWAeCy'
];

// Интерфейс для NFT метаданных
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

// Интерфейс для NFT с дополнительными данными
export interface NFTItem {
  id: string;
  address: string;
  collection: string;
  metadata: NFTMetadata;
  isFarming: boolean;
  lastFarmTime?: number;
  collectedTokens?: number;
}

// Создаем клиент TON с правильным эндпоинтом
const tonClient = new TonClient({
  endpoint: 'https://toncenter.com/api/v2/jsonRPC',
  apiKey: config.TONCENTER_API_KEY,
});

interface TONNFTResponse {
  result: Array<{
    address: string;
    collection_address: string;
  }>;
}

interface TONNFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

interface TonCenterNFTResponse {
  nfts: Array<{
    address: string;
    collection_address: string;
  }>;
}

interface TonAPIResponse {
  nft_items: Array<{
    address: string;
    collection?: {
      address: string;
    };
    metadata?: {
      name?: string;
      description?: string;
      image?: {
        original?: string;
      } | string;
      attributes?: Array<{
        trait_type: string;
        value: string;
      }>;
    };
  }>;
}

// Функция для конвертации адреса в формат v4R2
function toV4Address(address: string): string {
  try {
    // Если адрес уже в формате v4, возвращаем как есть
    if (address.startsWith('EQ') && address.length === 48) {
      return address;
    }

    // Если адрес в формате 0:, конвертируем в v4
    if (address.startsWith('0:')) {
      return Address.parseRaw(address).toString({ urlSafe: true, bounceable: true });
    }

    // Пробуем распарсить как есть
    return Address.parse(address).toString({ urlSafe: true, bounceable: true });
  } catch (error) {
    console.error('❌ Ошибка конвертации адреса:', error);
    return address;
  }
}

// Функция для получения всех NFT пользователя через TON API
export async function getUserNFTs(userAddress: string): Promise<NFTItem[]> {
  try {
    console.log('🚀 Начинаем получение NFT...');
    console.log('👤 Адрес пользователя:', userAddress);
    
    // Проверяем кэш
    if (typeof window !== 'undefined') {
      const cachedData = localStorage.getItem(`nft_cache_${userAddress}`);
      const cachedTimestamp = localStorage.getItem(`nft_cache_timestamp_${userAddress}`);
      
      // Если есть кэшированные данные и они не старше 5 минут, используем их
      if (cachedData && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        const now = Date.now();
        const cacheAge = now - timestamp;
        
        // Кэш действителен 5 минут
        if (cacheAge < 5 * 60 * 1000) {
          console.log('📦 Используем кэшированные данные NFT');
          return JSON.parse(cachedData);
        }
      }
      
      // Проверяем, не было ли недавних запросов к API
      const lastApiCall = localStorage.getItem('last_api_call_timestamp');
      if (lastApiCall) {
        const timestamp = parseInt(lastApiCall);
        const now = Date.now();
        const timeSinceLastCall = now - timestamp;
        
        // Если прошло менее 3 секунд с последнего запроса, используем кэш или возвращаем пустой массив
        if (timeSinceLastCall < 3000) {
          console.log('⚠️ Слишком частые запросы к API, ожидаем...');
          
          if (cachedData) {
            console.log('📦 Используем кэшированные данные NFT (из-за ограничения частоты запросов)');
            return JSON.parse(cachedData);
          }
          
          // Если кэша нет, возвращаем пустой массив
          console.log('⚠️ Нет кэшированных данных, возвращаем пустой массив');
          return [];
        }
      }
      
      // Обновляем время последнего запроса к API
      localStorage.setItem('last_api_call_timestamp', Date.now().toString());
    }
    
    // Конвертируем адрес пользователя в v4 формат
    const v4UserAddress = toV4Address(userAddress);
    console.log('👤 Адрес пользователя (v4):', v4UserAddress);
    
    console.log('📋 Поддерживаемые коллекции:', SUPPORTED_COLLECTIONS);

    // Проверяем адрес
    if (!v4UserAddress || v4UserAddress.length < 10) {
      console.error('❌ Неверный адрес кошелька:', v4UserAddress);
      return [];
    }

    console.log('🔍 Получаем ВСЕ NFT для адреса:', v4UserAddress);

    // Сначала получаем все NFT
    const response = await fetch(
      `https://tonapi.io/v2/accounts/${v4UserAddress}/nfts`,
      {
        headers: {
          'Authorization': `Bearer ${config.TONAPI_KEY}`,
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Ошибка API:', response.status, errorText);
      
      // Если есть кэшированные данные, используем их в случае ошибки
      if (typeof window !== 'undefined') {
        const cachedData = localStorage.getItem(`nft_cache_${userAddress}`);
        if (cachedData) {
          console.log('📦 Используем кэшированные данные NFT (из-за ошибки API)');
          return JSON.parse(cachedData);
        }
      }
      
      throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
    }

    const data: TonAPIResponse = await response.json();
    console.log('✅ Получен ответ API:', data);
    
    if (!data.nft_items || !Array.isArray(data.nft_items)) {
      console.log('ℹ️ NFT не найдены для этого адреса');
      return [];
    }

    console.log('📦 Всего найдено NFT на кошельке:', data.nft_items.length);

    // Фильтруем NFT по поддерживаемым коллекциям
    const supportedNFTs = data.nft_items.filter(item => {
      const collectionAddress = item.collection?.address || '';
      const v4CollectionAddress = toV4Address(collectionAddress);
      
      console.log('🔍 Проверяем NFT:');
      console.log('- Адрес NFT:', toV4Address(item.address));
      console.log('- Адрес коллекции (исходный):', collectionAddress);
      console.log('- Адрес коллекции (v4):', v4CollectionAddress);
      console.log('- Ищем среди коллекций:', SUPPORTED_COLLECTIONS);
      
      const isSupported = SUPPORTED_COLLECTIONS.includes(v4CollectionAddress);
      console.log(`${isSupported ? '✅ НАЙДЕНО СОВПАДЕНИЕ!' : '❌ Коллекция не поддерживается'}`);
      
      return isSupported;
    });

    console.log('✨ Поддерживаемых NFT найдено:', supportedNFTs.length);

    // Преобразуем данные
    const nfts: NFTItem[] = supportedNFTs.map(item => {
      console.log(`Обработка NFT: ${toV4Address(item.address)}`);
      console.log(`Метаданные:`, item.metadata);
      
      // Получаем URL изображения
      let imageUrl = 'https://placehold.co/400x400?text=No+Image';
      if (item.metadata?.image) {
        if (typeof item.metadata.image === 'string') {
          imageUrl = item.metadata.image;
        } else if (item.metadata.image.original) {
          imageUrl = item.metadata.image.original;
        }
      }

      return {
        id: toV4Address(item.address),
        address: toV4Address(item.address),
        collection: toV4Address(item.collection?.address || ''),
        metadata: {
          name: item.metadata?.name || 'Unnamed NFT',
          description: item.metadata?.description || '',
          image: imageUrl,
          attributes: item.metadata?.attributes || [],
        },
        isFarming: false,
        lastFarmTime: 0,
        collectedTokens: 0,
      };
    });

    // Сохраняем результаты в кэш
    if (typeof window !== 'undefined' && nfts.length > 0) {
      localStorage.setItem(`nft_cache_${userAddress}`, JSON.stringify(nfts));
      localStorage.setItem(`nft_cache_timestamp_${userAddress}`, Date.now().toString());
    }

    console.log('✅ Итоговые NFT:', nfts);
    return nfts;
  } catch (error) {
    console.error('❌ Ошибка получения NFT:', error);
    
    // Если есть кэшированные данные, используем их в случае ошибки
    if (typeof window !== 'undefined') {
      const cachedData = localStorage.getItem(`nft_cache_${userAddress}`);
      if (cachedData) {
        console.log('📦 Используем кэшированные данные NFT (из-за ошибки)');
        return JSON.parse(cachedData);
      }
    }
    
    return [];
  }
}

// Функция для расчета накопленных токенов
export function calculateTokens(nft: NFTItem, isPro: boolean = false): number {
  if (!nft.isFarming || !nft.lastFarmTime) return 0;

  const now = Date.now();
  const hoursSinceFarm = (now - nft.lastFarmTime) / (1000 * 60 * 60);
  const baseTokens = Math.min(hoursSinceFarm, 12); // Максимум 12 часов
  
  // Рассчитываем токены с учетом PRO-статуса и округляем до 2 знаков
  const tokens = isPro ? baseTokens * 1.5 : baseTokens;
  return parseFloat(tokens.toFixed(2));
} 