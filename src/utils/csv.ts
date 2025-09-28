import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { FeedbackWithSession } from '@/types/database';

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

export async function exportFeedbackToCsv(feedback: FeedbackWithSession[], fileName: string) {
  const header = [
    'Fecha',
    'Rutina',
    'RPE',
    'Dolor',
    'Adherencia',
    'Comentarios',
    'Rating'
  ];

  const rows = feedback.map((item) => [
    escapeCsvValue(item.session?.date ?? ''),
    escapeCsvValue(item.routine?.title ?? ''),
    escapeCsvValue(item.rpe ?? ''),
    escapeCsvValue(item.pain ?? ''),
    escapeCsvValue(item.adherence ?? ''),
    escapeCsvValue(item.comments ?? ''),
    escapeCsvValue(item.rating ?? '')
  ]);

  const csv = [header, ...rows].map((row) => row.join(',')).join('\n');
  const fileUri = `${FileSystem.documentDirectory}${fileName}.csv`;
  await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });

  const available = await Sharing.isAvailableAsync();
  if (available) {
    await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Exportar feedback' });
  }

  return fileUri;
}
