import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { SpotifyTrack } from '../services/spotify-api/search-service';

@Component({
  selector: 'app-audio-controller',
  templateUrl: './audio-controller.html',
  styleUrls: ['./audio-controller.css'],
  standalone: false
})
export class AudioController {
  @Input() currentSong!: SpotifyTrack | null;
  @Input() playlist: SpotifyTrack[] = [];

  isPlaying: boolean = false;
  private lastSongId: string | null = null;
  private simulatedTime: number = 0;
  private interval: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(): void {
    if (this.currentSong && this.currentSong.id !== this.lastSongId) {
      this.lastSongId = this.currentSong.id;
      console.log('Nueva canción:', this.currentSong.name);
      this.simulatedTime = 0;
      
      // para que se auto reproduzca visualmente
      this.startSimulation();
    }
  }

  ngOnDestroy() {
    this.stopSimulation();
  }

  formatTime(ms?: number): string {
    if (!ms || isNaN(ms)) return '0:00';
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  currentTime(): number {
    return this.simulatedTime;
  }

  progress(): number {
    if (!this.currentSong?.duration_ms) return 0;
    return (this.simulatedTime / this.currentSong.duration_ms) * 100;
  }

  seekTo(event: any): void {
    if (!this.currentSong?.duration_ms) return;
    const percent = event.target.value / 100;
    this.simulatedTime = percent * this.currentSong.duration_ms;
  }

  duration(): number {
    return this.currentSong?.duration_ms || 0;
  }

  startSimulation(): void {
    this.stopSimulation();
    this.isPlaying = true;
    
    this.interval = setInterval(() => {
      if (this.currentSong && this.simulatedTime < this.currentSong.duration_ms) {
        this.simulatedTime += 100;
        this.cdr.detectChanges();
      } else {
        this.playNext();
      }
    }, 100);
  }

  stopSimulation(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isPlaying = false;
  }

  togglePlay(): void {
    console.log('Toggle play/pause');
    
    if (this.isPlaying) {
      this.stopSimulation();
      console.log('Pausado');
    } else {
      this.startSimulation();
      console.log('Reproduciendo');
    }
  }

  playNext(): void {
    console.log('⏭️ Siguiente canción');
    if (!this.currentSong || this.playlist.length === 0) {
      console.log('⚠️ No hay playlist');
      return;
    }
    
    const currentIndex = this.playlist.findIndex(t => t.id === this.currentSong!.id);
    console.log('Índice actual:', currentIndex);
    
    if (currentIndex >= 0 && currentIndex < this.playlist.length - 1) {
      const nextSong = this.playlist[currentIndex + 1];
      console.log('➡️ Siguiente:', nextSong.name);
      
      this.currentSong = nextSong;
      this.lastSongId = nextSong.id;
      this.simulatedTime = 0;
      
      this.cdr.detectChanges();
      
      if (this.isPlaying) {
        this.startSimulation();
      }
    } else {
      console.log('Fin de la playlist');
      this.stopSimulation();
    }
  }

  playPrevious(): void {
    console.log('Canción anterior');
    if (!this.currentSong || this.playlist.length === 0) return;
    
    const currentIndex = this.playlist.findIndex(t => t.id === this.currentSong!.id);
    
    if (currentIndex > 0) {
      const prevSong = this.playlist[currentIndex - 1];
      console.log('Anterior:', prevSong.name);
      
      this.currentSong = prevSong;
      this.lastSongId = prevSong.id;
      this.simulatedTime = 0;
      
      this.cdr.detectChanges();
      
      if (this.isPlaying) {
        this.startSimulation();
      }
    } else {
      console.log('Ya estás en la primera canción');
    }
  }
}