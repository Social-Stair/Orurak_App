import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 기본 URL 설정 (명세서의 공통 뒷부분)
const apiClient = axios.create({
  // 백엔드 URL 패턴이 함수명에 따라 다르기 때문에, 여긴 비워두고 호출할 때 전체 URL 작성
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청을 보내기 직전에 가로채서 토큰을 무조건 넣어주는 로직
apiClient.interceptors.request.use(
  async (config) => {
    // 폰에 저장된 토큰을 꺼내옴
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 헤더에 토큰 장착
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;