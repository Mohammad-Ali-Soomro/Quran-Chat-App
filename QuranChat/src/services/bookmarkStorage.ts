import AsyncStorage from '@react-native-async-storage/async-storage';
import { AyahData } from '../constants/ayahData';

const BOOKMARKS_KEY = 'ayah_bookmarks';

export async function saveBookmark(ayah: AyahData): Promise<void> {
  try {
    const existing = await getBookmarks();
    if (!existing.find(a => a.id === ayah.id)) {
      existing.push(ayah);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(existing));
    }
  } catch {
    // Silently fail
  }
}

export async function getBookmarks(): Promise<AyahData[]> {
  try {
    const data = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function removeBookmark(id: number): Promise<void> {
  try {
    const existing = await getBookmarks();
    const filtered = existing.filter(a => a.id !== id);
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
  } catch {
    // Silently fail
  }
}

export async function isBookmarked(id: number): Promise<boolean> {
  try {
    const bookmarks = await getBookmarks();
    return bookmarks.some(a => a.id === id);
  } catch {
    return false;
  }
}
