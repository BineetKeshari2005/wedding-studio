export interface Template {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  theme: string;
}

const mockTemplates: Template[] = [
  {
    id: "tpl-001",
    name: "Royal Palace Affair",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
    theme: "Royal",
  },
  {
    id: "tpl-002",
    name: "Pastel Garden Dreams",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=400&fit=crop",
    theme: "Pastel",
  },
  {
    id: "tpl-003",
    name: "Boho Beach Sunset",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop",
    theme: "Boho",
  },
  {
    id: "tpl-004",
    name: "Minimal Elegance",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&h=400&fit=crop",
    theme: "Minimal",
  },
  {
    id: "tpl-005",
    name: "Golden Hour Romance",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=600&h=400&fit=crop",
    theme: "Traditional",
  },
  {
    id: "tpl-006",
    name: "Art Deco Glamour",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&h=400&fit=crop",
    theme: "Art Deco",
  },
  {
    id: "tpl-007",
    name: "Heritage Haveli Charm",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop",
    theme: "Traditional",
  },
  {
    id: "tpl-008",
    name: "Enchanted Forest",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&h=400&fit=crop",
    theme: "Boho",
  },
];

export default mockTemplates;
