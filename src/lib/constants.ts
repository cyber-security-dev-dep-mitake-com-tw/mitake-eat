export const RADIUS_OPTIONS = [
  { value: 500, label: "500m" },
  { value: 1000, label: "1km" },
  { value: 3000, label: "3km" },
  { value: 5000, label: "5km" },
  { value: 10000, label: "10km" },
] as const;

export const FOOD_TAGS = [
  "台式", "日式", "韓式", "義式", "美式", "泰式", "港式", "越式",
  "拉麵", "燒肉", "火鍋", "壽司", "甜點", "咖啡", "酒吧", "素食",
  "便當", "小吃", "滷味", "牛排", "海鮮", "早午餐", "buffet",
] as const;

export const PRICE_LEVEL_LABELS = ["免費", "便宜", "中等", "昂貴", "非常昂貴"];

export const SORT_OPTIONS = [
  { value: "rating_desc", labelKey: "sort.rating_desc" },
  { value: "rating_asc", labelKey: "sort.rating_asc" },
  { value: "distance", labelKey: "sort.distance" },
  { value: "price_asc", labelKey: "sort.price_asc" },
  { value: "price_desc", labelKey: "sort.price_desc" },
] as const;

export const DEFAULT_TARGET_COUNT = 10;
export const MIN_TARGET_COUNT = 3;
export const MAX_TARGET_COUNT = 30;

export const TAIPEI_COORDS = { lat: 25.033, lng: 121.565 };
