import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../constants';
import { CURRENT_USER } from '../../data/mockData';

const GroupCard = ({ group, expenses = [] }) => {
  const router = useRouter();

  const isHoster = group.hoster === CURRENT_USER;

  const activeExpenses = expenses.filter(
    (exp) => exp.groupId === group.id && exp.status !== 'finalized'
  );

  const totalPending = activeExpenses.reduce((sum, exp) => {
    const userParticipant = exp.participants.find(
      (p) => p.address === CURRENT_USER
    );
    return sum + (userParticipant && !userParticipant.paid ? userParticipant.amount : 0);
  }, 0);

  const handlePress = () => {
    router.push(`/groupDetail?id=${group.id}`);
  };

  const handleTimelinePress = (e) => {
    e.stopPropagation();
    router.push(`/groupTimeline?id=${group.id}`);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.groupName}>{group.name}</Text>
        {isHoster && (
          <View style={styles.hosterBadge}>
            <Text style={styles.hosterText}>👑 主辦</Text>
          </View>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>成員</Text>
          <Text style={styles.statValue}>{group.members.length} 人</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <Text style={styles.statLabel}>進行中帳款</Text>
          <Text style={styles.statValue}>{activeExpenses.length} 筆</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <Text style={styles.statLabel}>待付款</Text>
          <Text style={[styles.statValue, totalPending > 0 && styles.pendingAmount]}>
            $ {totalPending}
          </Text>
        </View>
      </View>

      {totalPending > 0 && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertText}>⚠️ 你有未付款項</Text>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.timelineButton}
          onPress={handleTimelinePress}
        >
          <Text style={styles.timelineButtonText}>📅 查看時間線</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupName: {
    fontSize: SIZES.large,
    fontWeight: '700',
    color: COLORS.black,
    flex: 1,
  },
  hosterBadge: {
    backgroundColor: COLORS.gold + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hosterText: {
    fontSize: SIZES.xSmall,
    color: COLORS.gold,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: SIZES.xSmall,
    color: COLORS.gray,
    marginBottom: 4,
  },
  statValue: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
  },
  pendingAmount: {
    color: '#FF5722',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.lightGray || '#E0E0E0',
  },
  alertBanner: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  alertText: {
    fontSize: SIZES.small,
    color: '#856404',
    fontWeight: '600',
  },
  actionsContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray || '#E0E0E0',
    paddingTop: 12,
  },
  timelineButton: {
    backgroundColor: COLORS.gold + '10',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  timelineButtonText: {
    fontSize: SIZES.small,
    color: COLORS.gold,
    fontWeight: '600',
  },
});

export default GroupCard;
