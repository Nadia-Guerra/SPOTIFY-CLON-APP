import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
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
  @Output() songChanged = new EventEmitter<SpotifyTrack>();

  isPlaying: boolean = false;
  private lastSongId: string | null = null;
  private simulatedTime: number = 0;
  private interval: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(): void {
    console.log('ngOnChanges - currentSong:', this.currentSong?.name);
    console.log('Playlist length:', this.playlist.length);
    
    if (this.currentSong && this.currentSong.id !== this.lastSongId) {
      this.lastSongId = this.currentSong.id;
      console.log('Nueva canción detectada:', this.currentSong.name);
      this.simulatedTime = 0;
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

  //le da play o pause
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
    console.log('Playlist:', this.playlist.length, 'canciones');
    console.log('Canción actual:', this.currentSong?.name);
    
    if (!this.currentSong || this.playlist.length === 0) {
      console.warn('No hay playlist o canción actual');
      return;
    }
    
    const currentIndex = this.playlist.findIndex(t => t.id === this.currentSong!.id);
    console.log('Índice actual:', currentIndex, '/', this.playlist.length - 1);
    
    if (currentIndex >= 0 && currentIndex < this.playlist.length - 1) {//que no sea la ultima
      const nextSong = this.playlist[currentIndex + 1]; 
      console.log('Siguiente canción:', nextSong.name); //o sea q  si no es la ulltima pasa a la siguiente
      
      // Notificar al padre
      this.songChanged.emit(nextSong);
      this.simulatedTime = 0;
    } else {
      this.stopSimulation();
    }
  }

  playPrevious(): void {
    console.log('Playlist:', this.playlist.length, 'canciones');
    
    if (!this.currentSong || this.playlist.length === 0) {
      console.warn('No hay playlist o canción actual');
      return;
    }
    
    const currentIndex = this.playlist.findIndex(t => t.id === this.currentSong!.id);
    console.log('Índice actual:', currentIndex);
    
    if (currentIndex > 0) {//que no sea la primera
      const prevSong = this.playlist[currentIndex - 1];
      
      // Notificar al padre
      this.songChanged.emit(prevSong);
      this.simulatedTime = 0;
    } else {
      console.log('Ya estás en la primera canción');
    }
  }
}