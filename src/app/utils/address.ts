import { Address } from '@ton/ton';

// Функция для конвертации адреса в формат v4R2
export function toV4Address(address: string | null): string {
  if (!address) return '';
  
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

// Функция для форматирования адреса для отображения (сокращение)
export function formatAddress(address: string | null, length: number = 8): string {
  if (!address) return '';
  
  const v4Address = toV4Address(address);
  
  if (v4Address.length <= length * 2) {
    return v4Address;
  }
  
  return `${v4Address.substring(0, length)}...${v4Address.substring(v4Address.length - length)}`;
} 