
const LOCAL_IP = '127.0.0.1'; 

const isProduction = false;

const getApiBaseUrl = (): string => {
  if (isProduction) {
    return 'https://agro-api.1xx07zte4dsp2.us-east-1.cs.amazonlightsail.com/api/v1';
  }

  // Desarrollo
  return `http://${LOCAL_IP}:8000`;

};

export const API_BASE_URL: string = getApiBaseUrl();

export const API_ENDPOINTS = {
    // Despensa
    PANTRIES: '/pantries',

    // Product type
    PRODUCT_TYPE: '/product_types',
  
    // Products
    PRODUCT: '/products',

    // Stores
    STORES: '/stores',

    // USers
    USERS: '/users',

    // Recipes
    RECIPES: '/recipes'
};

export const logApiCall = (endpoint: string, method = 'GET', data = null) => {
  //if (process.env.NODE_ENV !== 'production') {
    if (true) {
      console.log(`🌐 API Call: ${method} ${API_BASE_URL}${endpoint}`);
    if (data) {
      //console.log('📦 Data:', JSON.stringify(data, null, 2));
    }
  }
};

export const handleApiResponse = async (
  response: Response
): Promise<any> => {

  if (!response.ok) {
    let errorMessage =
      `HTTP ${response.status}: ${response.statusText}`;

    try {
      const errorData = await response.json();

      if (errorData.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message;

      } else if (errorData.error) {
        errorMessage = errorData.error;
      }

    } catch (err) {
      console.error(err);
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  logApiCall,
  handleApiResponse,
};