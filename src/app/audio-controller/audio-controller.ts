import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SpotifyTrack } from '../services/spotify-api/search-service';

@Component({
  selector: 'app-audio-controller',
  templateUrl: './audio-controller.html',
  styleUrls: ['./audio-controller.css'],
  standalone: false
})
export class AudioController implements OnChanges {
  @Input() currentSong!: SpotifyTrack | null;
  @Input() playlist: SpotifyTrack[] = [];

  private audio: HTMLAudioElement = new Audio();
  isPlaying: boolean = false;
  currentTrackIndex = -1;

  formatTime(ms?: number): string {
    if (!ms || isNaN(ms)) return '0:00';
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  currentTime(): number {
    return (this.audio.currentTime || 0) * 1000;
  }

  progress(): number {
    if (!this.currentSong?.duration_ms) return 0;
    return ((this.audio.currentTime * 1000) / this.currentSong.duration_ms) * 100;
  }

  seekTo(event: any): void {
    if (!this.currentSong?.duration_ms) return;
    const percent = event.target.value / 100;
    this.audio.currentTime = percent * (this.currentSong.duration_ms / 1000);
  }

  duration(): number {
    return this.currentSong?.duration_ms || 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentSong'] && this.currentSong && this.currentSong.preview_url) {
      this.setCurrentTrack();
      this.play();
    }
  }

  setCurrentTrack() {
    if (!this.currentSong?.preview_url) return;
    this.audio.src = this.currentSong.preview_url;
    this.audio.load();
    this.isPlaying = false;
  }

  play(): void {
    if (!this.currentSong?.preview_url) return;
    this.audio.play();
    this.isPlaying = true;
  }

  pause(): void {
    this.audio.pause();
    this.isPlaying = false;
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  playNext(): void {
    if (!this.currentSong) return;
    const ix = this.playlist.findIndex(t => t.id === this.currentSong!.id);
    if (ix >= 0 && ix < this.playlist.length - 1) {
      this.currentSong = this.playlist[ix + 1];
      if (this.currentSong.preview_url) {
        this.setCurrentTrack();
        this.play();
      }
    }
  }

  playPrevious(): void {
    if (!this.currentSong) return;
    const ix = this.playlist.findIndex(t => t.id === this.currentSong!.id);
    if (ix > 0) {
      this.currentSong = this.playlist[ix - 1];
      if (this.currentSong.preview_url) {
        this.setCurrentTrack();
        this.play();
      }
    }
  }
}
