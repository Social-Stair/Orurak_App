import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import CustomButton from '../components/customButton';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

// 회원가입 API 함수 불러오기
import { registerUser } from '../api/socialStairApi';

export default function RegisterScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState(''); // 비밀번호 확인용
  const [nickname, setNickname] = useState('');
  const [floor, setFloor] = useState('');

  const handleRegister = async () => {
    // 1. 유효성 검사
    if (!email || !password || !passwordConfirm || !nickname || !floor) {
      Alert.alert('알림', '모든 항목을 입력해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      // 2. 백엔드 회원가입 API 호출
      await registerUser(email, password, nickname, floor); // [cite: 13]
      
      // 3. 성공 처리
      Alert.alert('회원가입 완료', '가입이 완료되었습니다.\n로그인 화면에서 접속해주세요.', [
        { 
          text: '확인', 
          onPress: () => navigation.replace('Login') 
        }
      ]);

    } catch (error) {
      // 1. 서버에서 보내온 에러 메시지 추출
      const errorMessage = error.response?.data?.error || "";
      console.log('서버 에러 메시지:', errorMessage);

      if (error.response && error.response.status === 400) {
        // 2. 메시지 내용에 포함된 키워드별로 분기 처리
        if (errorMessage.includes('improperly formatted')) {
          Alert.alert('회원가입 실패', '이메일 형식이 올바르지 않습니다.\n(예: user@example.com)');
        } 
        else if (errorMessage.includes('at least 6 characters')) {
          Alert.alert('회원가입 실패', '비밀번호는 최소 6자리 이상으로 설정해주세요.');
        } 
        else if (errorMessage.includes('이미 사용중인')) {
          // 닉네임이나 이메일이 이미 존재할 때
          if (errorMessage.includes('닉네임')) {
            Alert.alert('회원가입 실패', '이미 사용 중인 닉네임입니다.');
          }
        }
        else if (errorMessage.includes('email address is already in use')) {
          Alert.alert('회원가입 실패', '이미 가입된 이메일입니다.');
        }
        else {
          // 그 외 기타 400 에러
          Alert.alert('회원가입 실패', '입력하신 정보가 서버 규칙에 맞지 않습니다. 다시 확인해주세요.');
        }
      } 
      else {
        // 500 에러 또는 네트워크 문제
        Alert.alert('오류', '서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* 뒤로 가기 버튼 */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={28} color={COLORS.black} />
          </TouchableOpacity>

          {/* 1. 상단 타이틀 영역 */}
          <View style={styles.headerContainer}>
            <Text style={styles.subHeader}>회원가입</Text>
            <Text style={styles.mainHeader}>아래 정보를 입력해주세요</Text>
          </View>

          {/* 입력 폼 영역 */}
          <View style={styles.formContainer}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.input}
                placeholder="사용할 이메일을 입력해주세요"
                placeholderTextColor={COLORS.gray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={styles.input}
                placeholder="사용할 비밀번호를 입력해주세요"
                placeholderTextColor={COLORS.gray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호 확인</Text>
              <TextInput
                style={styles.input}
                placeholder="비밀번호를 다시 한 번 입력해주세요"
                placeholderTextColor={COLORS.gray}
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                secureTextEntry={true}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>닉네임</Text>
              <TextInput
                style={styles.input}
                placeholder="사용할 닉네임을 입력해주세요"
                placeholderTextColor={COLORS.gray}
                value={nickname}
                onChangeText={setNickname}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>소속 층수</Text>
              <TextInput
                style={styles.input}
                placeholder="현재 건물 내 소속한 층수를 입력해주세요"
                placeholderTextColor={COLORS.gray}
                value={floor}
                onChangeText={setFloor}
                keyboardType="numeric" // 숫자 키보드 띄우기
              />
            </View>

          </View>

          {/* 버튼 영역 */}
          <View style={styles.actionContainer}>
            <CustomButton 
                title={loading ? "가입 처리 중..." : "회원가입 완료"}
                onPress={handleRegister} 
                disabled={loading}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 68,
    paddingBottom: 80,
  },
  backButton: {
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  headerContainer: {
    marginBottom: 20,
    gap: 2,
  },
  subHeader: {
    ...TYPOGRAPHY.subHeader,
  },
  mainHeader: {
    ...TYPOGRAPHY.mainHeader,
  },
  formContainer: {
    gap: 24,
    marginBottom: 40,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: COLORS.black,
  },
  input: {
    ...TYPOGRAPHY.placeholder,
    color: COLORS.black,
    width: '100%',
    height: 48,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  actionContainer: {
    marginTop: 20,
    alignItems: 'center',
    gap: 30,
  },
});