// utils/notifications.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/firebase";
import {
  getAllHabitsByOwner,
  getCompletedHabitsByHabitId,
  isHabitCompletedForPeriod,
} from "@/services/habitService";
import { onSnapshot, Query } from "firebase/firestore";

const STORAGE_KEYS = {
  SCHEDULED_IDS: "habitReminderScheduledIds",
};

// Permission + channel
export async function ensureNotificationSetup() {
  if (!Device.isDevice) return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.warn("Notifications permission not granted");
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Habit Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 200, 200, 200],
      bypassDnd: false,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  return true;
}

// Count habits scheduled today but not completed
export async function getPendingHabitCountToday(): Promise<number> {
  const user = auth.currentUser;
  if (!user) return 0;

  // Build the owner query
  const q: Query = getAllHabitsByOwner(user.uid);

  // Use a one-shot snapshot (we only need the data now)
  return new Promise((resolve) => {
    const unsub = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const list = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as any),
          }));

          const now = new Date();
          const isSunday = now.getDay() === 0;
          const isFirstDayOfMonth = now.getDate() === 1;

          let scheduledToday = list.filter((habit) => {
            if (habit.frequency === "Daily") return true;
            if (habit.frequency === "Weekly") return isSunday;
            if (habit.frequency === "Monthly") return isFirstDayOfMonth;
            return false;
          });

          let pending = 0;
          for (const habit of scheduledToday) {
            const completedList = await getCompletedHabitsByHabitId(
              habit.id,
              user.uid
            );
            const completedToday = completedList.some((c) =>
              isHabitCompletedForPeriod(habit, c.completedAt)
            );
            if (!completedToday) pending += 1;
          }

          resolve(pending);
        } catch (e) {
          console.error("Failed to compute pending habits:", e);
          resolve(0);
        } finally {
          unsub();
        }
      },
      (err) => {
        console.error("Error reading habits for count:", err);
        resolve(0);
      }
    );
  });
}

// Cancel previously scheduled reminders (only ours)
async function clearPreviouslyScheduled() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SCHEDULED_IDS);
    if (raw) {
      const ids: string[] = JSON.parse(raw);
      await Promise.all(
        ids.map((id) => Notifications.cancelScheduledNotificationAsync(id))
      );
    }
    await AsyncStorage.removeItem(STORAGE_KEYS.SCHEDULED_IDS);
  } catch (e) {
    console.warn("Could not clear old reminders:", e);
  }
}

// Schedule the two daily reminders with current count in the message
export async function scheduleDailyHabitReminders() {
  const ok = await ensureNotificationSetup();
  if (!ok) return;

  // Use current, fresh count at scheduling time
  const pending = await getPendingHabitCountToday();
  const bodyText =
    pending > 0
      ? `You have ${pending} habit${pending === 1 ? "" : "s"} left today. Let’s knock them out!`
      : "All set for today — great job! 🎉";

  await clearPreviouslyScheduled();

  const nineAM = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Morning Habit Check-in",
      body: bodyText,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });

  const sixPM = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Evening Habit Reminder",
      body: bodyText,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: 18,
      minute: 0,
      repeats: true,
    },
    ...(Platform.OS === "android"
      ? { identifier: "evening-habit-reminder" }
      : {}),
  } as any); // `identifier` is ignored on iOS; TS cast avoids friction.

  await AsyncStorage.setItem(
    STORAGE_KEYS.SCHEDULED_IDS,
    JSON.stringify([nineAM, sixPM])
  );
}

// Optional helper if you ever need to cancel the reminders
export async function cancelHabitReminders() {
  await clearPreviouslyScheduled();
}

// // export async function testNotification() {
// //     console.log("Scheduling test notification to fire in 5 seconds...");
    
// //   await Notifications.scheduleNotificationAsync({
// //     content: {
// //       title: "Test Habit Reminder",
// //       body: "This is a test notification to verify setup ✅",
// //       sound: true,
// //     },
// //     trigger: {
// //       type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
// //       seconds: 5, // fires 5 seconds after you tap the button
// //       repeats: false,
// //     },
// //   });
// }