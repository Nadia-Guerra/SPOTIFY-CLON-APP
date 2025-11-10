import { Component, Input, effect, ChangeDetectorRef } from '@angular/core';
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

  private audio: HTMLAudioElement = new Audio();
  isPlaying: boolean = false;
  private lastSongId: string | null = null;

  constructor(private cdr: ChangeDetectorRef) {
    this.audio.addEventListener('timeupdate', () => {
      this.cdr.detectChanges();
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.playNext();
    });

    this.audio.addEventListener('canplay', () => {
      console.log('Audio listo para reproducir');
    });

    // Si hay error
    this.audio.addEventListener('error', (e) => {
      console.error('Error en el audio:', e);
      this.isPlaying = false;
    });
  }

  ngOnChanges(): void {
    console.log('ngOnChanges - currentSong:', this.currentSong);
    
    if (this.currentSong && this.currentSong.id !== this.lastSongId) {
      this.lastSongId = this.currentSong.id;
      console.log('Nueva canción:', this.currentSong.name);
      console.log('Preview URL:', this.currentSong.preview_url);
      
      if (this.currentSong.preview_url) {
        this.loadAndPlay();
      } else {
        console.warn('Sin preview:', this.currentSong.name);
        alert(`"${this.currentSong.name}" no tiene preview disponible`);
      }
    }
  }

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

  loadAndPlay(): void {
    if (!this.currentSong?.preview_url) {
      console.warn('No hay preview_url para cargar');
      return;
    }

    console.log(' Pausando audio anterior');
    this.audio.pause();
    this.audio.currentTime = 0;
    
    console.log('Cargando URL:', this.currentSong.preview_url);
    this.audio.src = this.currentSong.preview_url;
    this.audio.load();
    
    console.log('Reproduciendo automáticamente...');
    this.audio.play()
      .then(() => {
        this.isPlaying = true;
        console.log('Reproduciendo:', this.currentSong?.name);
        this.cdr.detectChanges();
      })
      .catch(error => {
        console.error(' Error al reproducir:', error);
        this.isPlaying = false;
        this.cdr.detectChanges();
      });
  }

  togglePlay(): void {
    console.log('togglePlay - isPlaying:', this.isPlaying);
    console.log('currentSong:', this.currentSong);
    console.log('audio.src:', this.audio.src);
    
    if (!this.audio.src || this.audio.src === '') {
      console.warn('No hay audio cargado, cargando canción actual...');
      if (this.currentSong?.preview_url) {
        this.loadAndPlay();
      } else {
        alert('No hay canción para reproducir');
      }
      return;
    }
    
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      console.log('⏸️ Pausado');
    } else {
      this.audio.play()
        .then(() => {
          this.isPlaying = true;
          console.log('▶️ Reproduciendo');
          this.cdr.detectChanges();
        })
        .catch(error => {
          console.error('Error al reproducir:', error);
          this.isPlaying = false;
        });
    }
  }

  playNext(): void {
    console.log('⏭️ playNext llamado');
    if (!this.currentSong || this.playlist.length === 0) {
      console.log('No hay playlist o canción actual');
      return;
    }
    
    const ix = this.playlist.findIndex(t => t.id === this.currentSong!.id);
    console.log('Índice actual:', ix, 'Total:', this.playlist.length);
    
    if (ix >= 0 && ix < this.playlist.length - 1) {
      const nextSong = this.playlist[ix + 1];
      console.log('Siguiente canción:', nextSong.name);
      
      if (nextSong.preview_url) {
        this.currentSong = nextSong;
        this.lastSongId = nextSong.id;
        this.loadAndPlay();
      } else {
        console.warn('La siguiente canción no tiene preview');
        alert(`"${nextSong.name}" no tiene preview`);
      }
    } else {
      console.log('🔚 Fin de la playlist');
    }
  }

  playPrevious(): void {
    console.log('playPrevious llamado');
    if (!this.currentSong || this.playlist.length === 0) return;
    
    const ix = this.playlist.findIndex(t => t.id === this.currentSong!.id);
    if (ix > 0) {
      const prevSong = this.playlist[ix - 1];
      console.log('Canción anterior:', prevSong.name);
      
      if (prevSong.preview_url) {
        this.currentSong = prevSong;
        this.lastSongId = prevSong.id;
        this.loadAndPlay();
      } else {
        console.warn('La canción anterior no tiene preview');
      }
    }
  }
}