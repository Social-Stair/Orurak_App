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

export default function RegisterScreen({ navigation }) {
  // 회원가입 속성
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [floor, setFloor] = useState('');

  const handleRegister = () => {
    // 1. 하나라도 입력되지 않은 칸이 있는지 검사
    if (!email || !password || !nickname || !floor) {
      Alert.alert(
        '입력 오류', // 알림창 제목
        '모든 정보를 빠짐없이 입력해주세요!', // 알림창 내용
        [{ text: '확인' }] // 확인 버튼
      );
      return;
    }

    // 2. 모든 칸이 채워졌다면 성공 처리 (회원가입 API)
    console.log('회원가입 성공 데이터:', { email, password, nickname, floor });
    
    // 3. 성공 알림창을 띄우고, 확인을 누르면 로그인 화면으로 이동
    Alert.alert(
      '회원가입 완료',
      '성공적으로 가입되었습니다. 로그인해주세요.',
      [
        { 
          text: '확인', 
          onPress: () => navigation.navigate('Login')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* 1. 상단 타이틀 영역 */}
          <View style={styles.headerContainer}>
            <Text style={styles.subHeader}>회원가입</Text>
            <Text style={styles.mainHeader}>아래 정보를 입력해주세요</Text>
          </View>

          {/* 2. 입력 폼 영역 */}
          <View style={styles.formContainer}>
            
            {/* 이메일 입력 */}
            <View style={styles.inputGroup}>
              <Text style={styles.sectionTitle}>이메일</Text>
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

            {/* 비밀번호 입력 */}
            <View style={styles.inputGroup}>
              <Text style={styles.sectionTitle}>비밀번호</Text>
              <TextInput
                style={styles.input}
                placeholder="사용할 비밀번호를 입력해주세요"
                placeholderTextColor={COLORS.gray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* 닉네임 입력 */}
            <View style={styles.inputGroup}>
              <Text style={styles.sectionTitle}>닉네임</Text>
              <TextInput
                style={styles.input}
                placeholder="사용할 닉네임을 입력해주세요"
                placeholderTextColor={COLORS.gray}
                value={nickname}
                onChangeText={setNickname}
                autoCapitalize="none"
              />
            </View>

            {/* 소속 층수 입력 */}
            <View style={styles.inputGroup}>
              <Text style={styles.sectionTitle}>소속 층수</Text>
              <TextInput
                style={styles.input}
                placeholder="현재 건물 내 소속한 층수를 입력해주세요"
                placeholderTextColor={COLORS.gray}
                value={floor}
                onChangeText={setFloor}
                keyboardType="numeric" // 숫자 키보드만 나오게 설정!
              />
            </View>
          </View>

          {/* 3. 버튼 및 하단 링크 영역 */}
          <View style={styles.actionContainer}>
            <CustomButton 
              title="회원가입" 
              onPress={handleRegister} 
            />
            
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>이미 계정이 있으신가요? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>로그인</Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 20,
    paddingTop: 68,
    paddingBottom: 40,
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
    gap: 20,
  },
  inputGroup: {
    gap: 10,
  },
  sectionTitle: {
    ...TYPOGRAPHY.sectionTitle,
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
  loginLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    ...TYPOGRAPHY.placeholder,
  },
  loginLink: {
    fontFamily: 'Pretendard-SemiBold',
    color: COLORS.gray,
    fontSize: 14,
  },
});