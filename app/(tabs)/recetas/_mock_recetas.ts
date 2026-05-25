export type Recipe = {
  id: number;
  name: string;
  description: string;
  duration: string;
  servings: string;
};

export const RECIPES: Recipe[] = [
  {
    id: 1,
    name: 'Pasta Carbonara',
    description: 'Primero hervir abundante agua con sal y cocinar la pasta hasta que quede al dente. Mientras tanto freír el tocino hasta dorar. Batir huevo con queso parmesano en un recipiente aparte. Mezclar la pasta caliente con el tocino y retirar del fuego. Agregar la mezcla de huevo revolviendo constantemente y servir de inmediato.',
    duration: '20 min',
    servings: '2 porciones',
  },
  {
    id: 2,
    name: 'Ensalada César',
    description: 'Primero lavar y cortar la lechuga en trozos medianos. Cocinar y cortar el pollo en tiras o cubos. Preparar el aderezo mezclando mayonesa, limón y condimentos al gusto. Mezclar la lechuga con el pollo y el aderezo. Finalizar agregando queso rallado y crutones antes de servir.',
    duration: '15 min',
    servings: '3 porciones',
  },
  {
    id: 3,
    name: 'Arroz con Pollo',
    description: 'Primero cortar el pollo y dorarlo en una olla con un poco de aceite. Agregar cebolla y verduras picadas y cocinar unos minutos. Incorporar el arroz y revolver para mezclar sabores. Añadir agua o caldo y cocinar a fuego medio hasta que el arroz absorba el líquido. Dejar reposar unos minutos antes de servir.',
    duration: '40 min',
    servings: '4 porciones',
  },
  {
    id: 4,
    name: 'Lentejas',
    description: 'Primero lavar las lentejas y dejarlas listas para cocinar. Sofreír cebolla, zanahoria y ajo en una olla. Agregar las lentejas junto con agua y condimentos al gusto. Cocinar a fuego medio hasta que estén blandas y el caldo espese ligeramente. Servir calientes acompañadas según preferencia.',
    duration: '50 min',
    servings: '5 porciones',
  },
  {
    id: 5,
    name: 'Panqueques',
    description: 'Primero mezclar harina, leche y huevos hasta obtener una masa homogénea. Agregar una pequeña cantidad de azúcar o esencia si se desea. Calentar una sartén con un poco de mantequilla o aceite. Verter una capa fina de mezcla y cocinar por ambos lados hasta dorar. Servir con acompañamientos dulces o salados.',
    duration: '20 min',
    servings: '4 porciones',
  },
  {
    id: 6,
    name: 'Lasagna',
    description: 'Capas de pasta con salsa y queso.',
    duration: '60 min',
    servings: '6 porciones',
  },
  {
    id: 7,
    name: 'Sopa de Tomate',
    description: 'Sopa cremosa y ligera.',
    duration: '25 min',
    servings: '3 porciones',
  },
  {
    id: 8,
    name: 'Tacos',
    description: 'Tacos de carne con vegetales frescos.',
    duration: '30 min',
    servings: '4 porciones',
  },
  {
    id: 9,
    name: 'Hamburguesa Casera',
    description: 'Hamburguesa con carne y vegetales.',
    duration: '35 min',
    servings: '2 porciones',
  },
  {
    id: 10,
    name: 'Pizza Margarita',
    description: 'Pizza clásica con tomate y queso.',
    duration: '45 min',
    servings: '4 porciones',
  },
  {
    id: 11,
    name: 'Puré con Carne',
    description: 'Puré cremoso acompañado de carne.',
    duration: '35 min',
    servings: '3 porciones',
  },
  {
    id: 12,
    name: 'Omelette',
    description: 'Omelette rápido con queso.',
    duration: '10 min',
    servings: '1 porción',
  },
  {
    id: 13,
    name: 'Cazuela',
    description: 'Plato chileno con verduras y carne.',
    duration: '70 min',
    servings: '5 porciones',
  },
  {
    id: 14,
    name: 'Pollo al Horno',
    description: 'Pollo dorado con especias.',
    duration: '55 min',
    servings: '4 porciones',
  },
  {
    id: 15,
    name: 'Risotto',
    description: 'Arroz cremoso con queso.',
    duration: '45 min',
    servings: '3 porciones',
  },
  {
    id: 16,
    name: 'Empanadas',
    description: 'Empanadas horneadas tradicionales.',
    duration: '50 min',
    servings: '6 porciones',
  },
  {
    id: 17,
    name: 'Wrap de Pollo',
    description: 'Wrap ligero con verduras frescas.',
    duration: '15 min',
    servings: '2 porciones',
  },
  {
    id: 18,
    name: 'Brownies',
    description: 'Brownies húmedos de chocolate.',
    duration: '35 min',
    servings: '8 porciones',
  },
  {
    id: 19,
    name: 'Pescado al Horno',
    description: 'Pescado con limón y especias.',
    duration: '30 min',
    servings: '3 porciones',
  },
  {
    id: 20,
    name: 'Gnocchi',
    description: 'Gnocchi suaves con salsa casera.',
    duration: '40 min',
    servings: '4 porciones',
  },
];