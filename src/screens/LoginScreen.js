import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import CustomButton from '../components/customButton';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

const logoImage = require('../../assets/images/logo.png');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* 1. 로고 영역 */}
        <View style={styles.logoContainer}>
          <View style={styles.shadowBox}>
            <Image
              source={logoImage}
              style={styles.logo}
              resizeMode='contain'
            />
          </View>
          <Text style={styles.logoText}>오르락</Text>
        </View>

        {/* 2. 입력 폼 영역 */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="이메일을 입력해주세요"
            placeholderTextColor={COLORS.gray} // 색상 상수 적용
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력해주세요"
            placeholderTextColor={COLORS.gray} // 색상 상수 적용
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <CustomButton 
            title="로그인" 
            onPress={() => {
              // 임시로 바로 화면이 넘어가도록 설정 (로그인 API)
              navigation.navigate('Initial');
            }}
            style={{ marginTop: 20 }}
          />
          
        </View>

        {/* 3. 회원가입 링크 영역 */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>계정이 없으신가요? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupLink}>회원가입</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  shadowBox: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    marginBottom: 12,
  },
  logo: {
    width: 76,
    height: 76,
  },
  logoText: {
    fontFamily: 'Pretendard-ExtraBold',
    color: COLORS.primary,
    fontSize: 28,
    letterSpacing: 28 * -0.025, // JS에서 연산 처리
  },
  formContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 30,
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
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    ...TYPOGRAPHY.placeholder, 
  },
  signupLink: {
    fontFamily: 'Pretendard-SemiBold',
    color: COLORS.gray,
    fontSize: 14,
  },
});