
import { Channel } from '../types';

const PLAYLIST_URL = 'https://raw.githubusercontent.com/Megarfla/Mt/refs/heads/main/tv';
const CACHE_KEY = 'bravo_tv_playlist_cache';

export async function fetchPlaylist(): Promise<Channel[]> {
  try {
    const response = await fetch(PLAYLIST_URL);
    if (!response.ok) throw new Error('Failed to fetch playlist');
    const data = await response.text();
    const channels = parseM3U(data);
    localStorage.setItem(CACHE_KEY, JSON.stringify(channels));
    return channels;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
    return [];
  }
}

function parseM3U(content: string): Channel[] {
  const lines = content.split('\n');
  const channels: Channel[] = [];
  let currentChannel: Partial<Channel> = {};
  let channelCounter = 1;

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('#EXTINF:')) {
      const info = line.substring(8);
      
      // Extract tvg-logo
      const logoMatch = info.match(/tvg-logo="([^"]+)"/);
      const nameMatch = info.match(/tvg-name="([^"]+)"/);
      const groupMatch = info.match(/group-title="([^"]+)"/);
      const tvgIdMatch = info.match(/tvg-id="([^"]+)"/);
      
      const displayName = info.split(',').pop()?.trim() || 'Unknown Channel';

      currentChannel = {
        id: tvgIdMatch?.[1] || `ch-${channelCounter}`,
        number: channelCounter,
        name: nameMatch?.[1] || displayName,
        logo: logoMatch?.[1] || `https://picsum.photos/seed/${channelCounter}/200/200`,
        group: groupMatch?.[1] || 'General',
        isFavorite: false,
        epgCurrent: 'Programação ao vivo',
        epgNext: 'Próximo conteúdo'
      };
    } else if (line.startsWith('http')) {
      if (currentChannel.name) {
        currentChannel.url = line;
        channels.push(currentChannel as Channel);
        channelCounter++;
      }
      currentChannel = {};
    }
  }

  return channels;
}
