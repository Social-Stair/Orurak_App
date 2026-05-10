import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// 기본 URL 설정
const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. [요청 가로채기] API를 보낼 때마다 토큰을 챙겨서 보냄
apiClient.interceptors.request.use(
  async (config) => {
    let token = null;
    if (Platform.OS === 'web') {
      token = await AsyncStorage.getItem('userToken');
    } else {
      token = await SecureStore.getItemAsync('userToken');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. [응답 가로채기] 401 에러(토큰 만료)가 나면 새 토큰을 받아옴!
apiClient.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config; 

    // 에러가 401(권한 없음)이고, 아직 재시도한 적이 없다면
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        let refreshToken = null;
        if (Platform.OS === 'web') {
          refreshToken = await AsyncStorage.getItem('refreshToken');
        } else {
          refreshToken = await SecureStore.getItemAsync('refreshToken');
        }

        if (!refreshToken) {
          return Promise.reject(error);
        }

        // 토큰 갱신 API 호출
        const refreshResponse = await axios.post('https://refreshtoken-3dgekfmjca-uc.a.run.app', {
          refreshToken: refreshToken 
        });

        const newToken = refreshResponse.data.token; 
        const newRefreshToken = refreshResponse.data.refreshToken; 

        // 새로 발급받은 토큰들을 다시 저장
        if (Platform.OS === 'web') {
          await AsyncStorage.setItem('userToken', newToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
        } else {
          await SecureStore.setItemAsync('userToken', newToken);
          await SecureStore.setItemAsync('refreshToken', newRefreshToken);
        }

        // 원래 요청의 헤더를 새 토큰으로 교체해서 다시 전송
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.log("토큰 갱신 실패! 다시 로그인해야 합니다.", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;