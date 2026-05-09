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

import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import SuccessModal from '../components/SuccessModal';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

// 임시 데이터 (데이터 불러오기)
const initialData = {
  moveMethod: '계단',
  recordTimes: ['오전 08:30', '오후 12:00'],
  startFloor: '1',
  endFloor: '12',
  satisfaction: 5,
  journalText: '오늘도 출근길에 계단을 이용했다. 꽤 상쾌함!',
  withFriend: true,
};

export default function RecordDetailScreen({ navigation }) {
  // 기존 데이터로 초기 상태 세팅
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [moveMethod, setMoveMethod] = useState(initialData.moveMethod); 
  const [recordTimes, setRecordTimes] = useState([...initialData.recordTimes]); 
  
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(null);

  const [startFloor, setStartFloor] = useState(initialData.startFloor);
  const [endFloor, setEndFloor] = useState(initialData.endFloor);
  const [satisfaction, setSatisfaction] = useState(initialData.satisfaction);
  const [journalText, setJournalText] = useState(initialData.journalText);
  const [withFriend, setWithFriend] = useState(initialData.withFriend);

  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [achievementRate, setAchievementRate] = useState(30); 
  const [modalTitle, setModalTitle] = useState('수정 완료!');
  const [modalSubText, setModalSubText] = useState('기록이 성공적으로 수정되었습니다.');

  const isStairs = moveMethod === '계단';
  const isNotWorking = moveMethod === '출근 안 함';

  // 데이터가 변경되었는지 확인
  const hasChanges = 
    moveMethod !== initialData.moveMethod ||
    JSON.stringify(recordTimes) !== JSON.stringify(initialData.recordTimes) ||
    startFloor !== initialData.startFloor ||
    endFloor !== initialData.endFloor ||
    satisfaction !== initialData.satisfaction ||
    journalText !== initialData.journalText ||
    withFriend !== initialData.withFriend;

  const handleSelectMethod = (method) => {
    setMoveMethod(method);
    setIsDropdownOpen(false);
    
    if (method === '출근 안 함') {
      setRecordTimes(['']);
      setStartFloor('');
      setEndFloor('');
      setSatisfaction(1);
      setJournalText('');
      setWithFriend(false);
    } 
    else if (method === '엘리베이터') {
      setRecordTimes(['']);
      setStartFloor('');
      setEndFloor('');
      setWithFriend(false);
    }
  };

  const addTimeInput = () => {
    if (isStairs) setRecordTimes([...recordTimes, '']);
  };

  const removeTimeInput = (indexToRemove) => {
    const newTimes = recordTimes.filter((_, index) => index !== indexToRemove);
    setRecordTimes(newTimes);
  };

  const showTimePicker = (index) => {
    if (!isStairs) return;
    setCurrentTimeIndex(index);
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = `${ampm} ${hours}:${minutes}`;

    const newTimes = [...recordTimes];
    newTimes[currentTimeIndex] = strTime;
    setRecordTimes(newTimes);
    hideTimePicker();
  };

  // 삭제 로직
  const handleDelete = () => {
    Alert.alert('기록 삭제', '정말로 이 일지를 삭제하시겠어요?', [
      { text: '취소', style: 'cancel' },
      { 
        text: '삭제', 
        style: 'destructive', 
        onPress: () => {
          console.log('일지 삭제됨!');
          navigation.goBack(); 
        } 
      }
    ]);
  };

  // 수정 로직
  const handleEdit = () => {
    if (moveMethod === '계단') {
      const hasEmptyTime = recordTimes.some(time => time === '');
      if (hasEmptyTime || !startFloor || !endFloor || !journalText) {
        Alert.alert('알림', '시간, 층수, 성찰 일지를 모두 입력해주세요!');
        return; 
      }
    } else if (moveMethod === '엘리베이터') {
      if (!journalText) {
        Alert.alert('알림', '성찰 일지를 작성해주세요!');
        return;
      }
    }

    console.log('기록 수정 완료:', { moveMethod, recordTimes, startFloor, endFloor, satisfaction, journalText, withFriend });
    setSuccessModalVisible(true);
  };

  const handleModalComplete = () => {
    setSuccessModalVisible(false);
    navigation.goBack();
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
              <Text style={styles.mainHeader}>나의 오르락 기록</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="x" size={28} color={COLORS.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.sectionTitle}>어떤 이동 방법을 선택하셨나요?</Text>
              <TouchableOpacity 
                style={styles.dropdownBox} 
                activeOpacity={0.8}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Text style={styles.dropdownText}>{moveMethod}</Text>
                <Feather name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={24} color={COLORS.gray} />
              </TouchableOpacity>

              {isDropdownOpen && (
                <View style={styles.dropdownList}>
                  {['계단', '엘리베이터', '출근 안 함'].map((method) => (
                    <TouchableOpacity 
                      key={method} 
                      style={styles.dropdownItem}
                      onPress={() => handleSelectMethod(method)}
                    >
                      <Text style={styles.dropdownItemText}>{method}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.sectionTitle}>언제 오르셨나요?</Text>
              
              {recordTimes.map((time, index) => (
                <View key={index} style={styles.timeInputRow}>
                  <TouchableOpacity 
                    style={[styles.timeInputWrapper, !isStairs && styles.disabledInput]}
                    onPress={() => showTimePicker(index)}
                    disabled={!isStairs}
                  >
                    <Text style={[styles.timeInputText, !time && styles.placeholderText]}>
                      {time || "예) 오후 12:00"}
                    </Text>
                  </TouchableOpacity>
                  
                  {index === recordTimes.length - 1 ? (
                    <TouchableOpacity 
                      style={[styles.plusButton, !isStairs && { backgroundColor: COLORS.gray }]} 
                      onPress={addTimeInput}
                      disabled={!isStairs}
                    >
                      <Feather name="plus" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      style={styles.minusButton} 
                      onPress={() => removeTimeInput(index)}
                    >
                      <Feather name="minus" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode="time"
                onConfirm={handleConfirmTime}
                onCancel={hideTimePicker}
                confirmTextIOS="확인"
                cancelTextIOS="취소"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.sectionTitle}>몇 층부터 몇 층까지 계단을 오르셨나요?</Text>
              <View style={styles.floorInputRow}>
                <TextInput
                  style={[styles.floorInput, !isStairs && styles.disabledInput]}
                  placeholder="예) 1층"
                  placeholderTextColor={COLORS.gray}
                  value={startFloor}
                  onChangeText={setStartFloor}
                  editable={isStairs}
                  keyboardType="numeric"
                />
                <Text style={styles.arrowText}>→</Text>
                <TextInput
                  style={[styles.floorInput, !isStairs && styles.disabledInput]}
                  placeholder="예) 12층"
                  placeholderTextColor={COLORS.gray}
                  value={endFloor}
                  onChangeText={setEndFloor}
                  editable={isStairs}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.sectionTitle}>방금 기록이 만족스러웠나요?</Text>
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
                  thumbTintColor={isNotWorking ? 'transparent' : COLORS.primary} 
                  disabled={isNotWorking} 
                />
                <View style={styles.satisfactionDotsRow}>
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <Text key={num} style={styles.scoreNumber}>{num}</Text>
                  ))}
                </View>
                <View style={styles.satisfactionLabels}>
                  <Text style={styles.satisfactionLabel}>매우 불만족</Text>
                  <Text style={styles.satisfactionLabel}>매우 만족</Text>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.sectionTitle}>성찰 일지</Text>
              <TextInput
                style={[styles.journalInput, isNotWorking && styles.disabledInput]}
                placeholder="선택하신 이동 방법에 대해 스스로에게 해주고 싶은 말이 있거나 지금 드는 생각을 자유롭게 적어주세요!"
                placeholderTextColor={COLORS.gray}
                multiline
                textAlignVertical="top"
                value={journalText}
                onChangeText={setJournalText}
                editable={!isNotWorking} 
              />
              
              {isStairs && (
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity 
                    style={styles.checkboxRow}
                    activeOpacity={0.8}
                    onPress={() => setWithFriend(!withFriend)}
                  >
                    <View style={[styles.checkbox, withFriend && styles.checkboxActive]}>
                      {withFriend && <Feather name="check" size={12} color={COLORS.white} />}
                    </View>
                    <Text style={styles.checkboxText}>친구와 함께 올랐어요!</Text>
                  </TouchableOpacity>
                  <Text style={styles.checkboxSubText}>
                    {"(계단 이용이 x2로 측정됩니다.\n연구원에게 인증 사진을 보내주세요!)"}
                  </Text>
                </View>
              )}
            </View>

          </View>

          {/* 삭제 & 수정하기 버튼 나란히 배치 */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteButtonText}>삭제하기</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.editButton, 
                // 수정된 곳이 없거나, 출근안함인데 일지가 비어있으면 회색으로 비활성화
                (!hasChanges || (isNotWorking && journalText === '')) && { backgroundColor: COLORS.gray }
              ]} 
              onPress={() => {
                if (!hasChanges || (isNotWorking && journalText === '')) return;
                handleEdit();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.editButtonText}>수정하기</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal 
        visible={isSuccessModalVisible}
        onClose={handleModalComplete}
        achievementRate={achievementRate}
        title={modalTitle}
        subText={modalSubText}
      />

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
    paddingBottom: 90,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginBottom: 24,
  },
  subHeader: {
    ...TYPOGRAPHY.subHeader,
    marginBottom: 2,
  },
  mainHeader: {
    ...TYPOGRAPHY.mainHeader,
  },
  formContainer: {
    gap: 24,
  },
  inputGroup: {
    gap: 10,
    zIndex: 1, 
  },
  sectionTitle: {
    ...TYPOGRAPHY.sectionTitle,
  },
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: COLORS.gray,
    letterSpacing: 14 * -0.025,
  },
  dropdownList: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginTop: -4, 
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  dropdownItemText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: COLORS.black,
    letterSpacing: 14 * -0.025,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInputWrapper: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  timeInputText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: COLORS.black,
  },
  placeholderText: {
    color: COLORS.gray,
  },
  plusButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primary, 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minusButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F24242', 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledInput: {
    backgroundColor: '#DBDEE6', 
  },
  floorInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floorInput: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    ...TYPOGRAPHY.placeholder,
    color: COLORS.black,
    textAlign: 'center',
  },
  arrowText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: COLORS.gray,
    marginHorizontal: 12,
  },
  satisfactionWrapper: {
    marginTop: 10,
    marginBottom: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  satisfactionDotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14, 
    marginTop: -4,
  },
  scoreNumber: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    color: COLORS.gray,
    letterSpacing: 14 * -0.025,
  },
  satisfactionLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  satisfactionLabel: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: COLORS.gray,
    letterSpacing: 12 * -0.025,
  },
  journalInput: {
    height: 145,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 16,
    ...TYPOGRAPHY.placeholder,
    color: COLORS.black,
  },
  checkboxContainer: {
    alignItems: 'center', 
    marginTop: 8,
    gap: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: COLORS.gray,
    letterSpacing: 14 * -0.025,
  },
  checkboxSubText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    color: COLORS.gray,
    letterSpacing: 14 * -0.025,
    textAlign: 'center', 
  },
  

  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
  },
  deleteButton: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#F24242', 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#F24242',
  },
  editButton: {
    flex: 2, // 삭제 버튼보다 살짝 넓게 비율 조정 (1:2 비율)
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
});