import React, { useState } from 'react';
import {
    ActivityIndicator,
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

import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import SuccessModal from '../components/SuccessModal';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

// API 함수 불러오기
import { deleteJournal, updateJournal } from '../api/socialStairApi';

export default function RecordDetailScreen({ route, navigation }) {
  const { journalData } = route.params || {};

  // [조회 전용 데이터] - 수정 불가
  const [moveMethod] = useState('계단'); 
  const [recordTimes] = useState(['오전 09:00']); 
  const [startFloor] = useState('1');
  const [endFloor] = useState('12');
  const [withFriend] = useState(true);

  // [수정 가능 데이터] - 성찰 일지와 만족도
  const [satisfaction, setSatisfaction] = useState(journalData?.satisfaction || 1);
  const [journalText, setJournalText] = useState(journalData?.content || '');
  
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 변경 여부 확인 (수정 완료 버튼 활성화용)
  const hasChanges = 
    satisfaction !== journalData?.satisfaction ||
    journalText !== journalData?.content;

  // 삭제 로직
  const handleDelete = () => {
    Alert.alert('기록 삭제', '정말로 이 일지를 삭제하시겠어요?', [
      { text: '취소', style: 'cancel' },
      { 
        text: '삭제', 
        style: 'destructive', 
        onPress: async () => {
          setLoading(true);
          try {
            await deleteJournal(journalData.id);
            Alert.alert('삭제 완료', '일지가 삭제되었습니다.', [
              { text: '확인', onPress: () => navigation.goBack() }
            ]);
          } catch (error) {
            Alert.alert('오류', '삭제 중 문제가 발생했습니다.');
          } finally {
            setLoading(false);
          }
        } 
      }
    ]);
  };

  // 수정 로직
  const handleEdit = async () => {
    setLoading(true);
    try {
      await updateJournal(journalData.id, journalText, satisfaction);
      setSuccessModalVisible(true);
    } catch (error) {
      Alert.alert('오류', '수정 중 문제가 발생했습니다.');
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
          
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.subHeader}>기록 확인</Text>
              <Text style={styles.mainHeader}>
                {journalData?.date ? journalData.date.replace(/-/g, '.') : ''} 기록
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="x" size={28} color={COLORS.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            
            {/* 1. 이동 방법 (조회 전용) */}
            <View style={styles.inputGroup}>
              <Text style={styles.sectionTitle}>이동 방법</Text>
              <View style={styles.disabledDropdownBox}>
                <Text style={styles.disabledText}>{moveMethod}</Text>
                <Feather name="lock" size={18} color={COLORS.gray} />
              </View>
            </View>

            {/* 2. 시간 (조회 전용) */}
            <View style={styles.inputGroup}>
              <Text style={styles.sectionTitle}>이동 시간</Text>
              {recordTimes.map((time, index) => (
                <View key={index} style={styles.disabledInputBox}>
                  <Text style={styles.disabledText}>{time}</Text>
                </View>
              ))}
            </View>

            {/* 3. 층수 (조회 전용) */}
            <View style={styles.inputGroup}>
              <Text style={styles.sectionTitle}>이용 층수</Text>
              <View style={styles.floorRow}>
                <View style={styles.disabledFloorBox}><Text style={styles.disabledText}>{startFloor}층</Text></View>
                <Text style={styles.arrowText}>→</Text>
                <View style={styles.disabledFloorBox}><Text style={styles.disabledText}>{endFloor}층</Text></View>
              </View>
            </View>

            {/* 4. 만족도 (수정 가능) */}
            <View style={styles.inputGroup}>
              <Text style={styles.sectionTitle}>이 기록이 만족스러웠나요?</Text>
              <View style={styles.satisfactionWrapper}>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={7}
                  step={1}
                  value={satisfaction}
                  onValueChange={(val) => setSatisfaction(val)}
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor="#DBDEE6"
                  thumbTintColor={COLORS.primary} 
                />
                <View style={styles.satisfactionDotsRow}>
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <Text key={num} style={[styles.scoreNumber, satisfaction === num && {color: COLORS.primary}]}>{num}</Text>
                  ))}
                </View>
              </View>
            </View>

            {/* 5. 성찰 일지 (수정 가능) */}
            <View style={styles.inputGroup}>
              <Text style={styles.sectionTitle}>성찰 일지</Text>
              <TextInput
                style={styles.journalInput}
                multiline
                textAlignVertical="top"
                value={journalText}
                onChangeText={setJournalText}
              />
              
              {/* 동료 여부 (조회 전용) */}
              <View style={styles.disabledCheckboxRow}>
                <View style={[styles.checkbox, withFriend && styles.checkboxActive]}>
                  {withFriend && <Feather name="check" size={12} color={COLORS.white} />}
                </View>
                <Text style={styles.disabledCheckboxText}>친구와 함께 올랐어요!</Text>
              </View>
            </View>

          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>삭제하기</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.editButton, (!hasChanges || loading) && { backgroundColor: COLORS.gray }]} 
              onPress={handleEdit}
              disabled={!hasChanges || loading}
            >
              {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.editButtonText}>수정 완료</Text>}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal 
        visible={isSuccessModalVisible}
        onClose={() => { setSuccessModalVisible(false); navigation.goBack(); }}
        achievementRate={0}
        title="수정 완료!"
        subText="기록이 성공적으로 수정되었습니다."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 68, paddingBottom: 90 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  subHeader: { ...TYPOGRAPHY.subHeader },
  mainHeader: { ...TYPOGRAPHY.mainHeader },
  formContainer: { gap: 24 },
  inputGroup: { gap: 10 },
  sectionTitle: { ...TYPOGRAPHY.sectionTitle },
  
  disabledDropdownBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    height: 48, backgroundColor: '#DBDEE6', borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 16,
  },
  disabledInputBox: {
    height: 48, backgroundColor: '#DBDEE6', borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, justifyContent: 'center', paddingHorizontal: 16,
  },
  floorRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  disabledFloorBox: {
    flex: 1, height: 48, backgroundColor: '#DBDEE6', borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, justifyContent: 'center', alignItems: 'center',
  },
  disabledText: { fontFamily: 'Pretendard-Medium', fontSize: 14, color: COLORS.gray },
  arrowText: { color: COLORS.gray, fontSize: 18 },

  // 수정 가능한 일지 입력창
  journalInput: {
    height: 120, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 16, fontFamily: 'Pretendard-Medium', fontSize: 14, color: COLORS.black,
  },
  
  // 만족도 슬라이더
  satisfactionWrapper: { marginTop: 10 },
  slider: { width: '100%', height: 40 },
  satisfactionDotsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14 },
  scoreNumber: { fontFamily: 'Pretendard-Medium', fontSize: 12, color: COLORS.gray },

  // 체크박스 (비활성화)
  disabledCheckboxRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, opacity: 0.6, justifyContent: 'center',},
  checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: COLORS.gray, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: COLORS.gray, borderColor: COLORS.gray },
  disabledCheckboxText: { fontFamily: 'Pretendard-Medium', fontSize: 14, color: COLORS.gray },

  actionRow: { flexDirection: 'row', gap: 12, marginTop: 40 },
  deleteButton: { flex: 1, height: 52, backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#F24242', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  deleteButtonText: { fontFamily: 'Pretendard-SemiBold', fontSize: 15, color: '#F24242' },
  editButton: { flex: 2, height: 52, backgroundColor: COLORS.primary, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  editButtonText: { fontFamily: 'Pretendard-SemiBold', fontSize: 15, color: COLORS.white },
});