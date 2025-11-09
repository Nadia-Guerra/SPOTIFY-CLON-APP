import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
  albums?: {
    items: SpotifyAlbum[];
  };
  artists?: {
    items: SpotifyArtist[];
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  preview_url: string | null;
  duration_ms: number;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  images: Array<{ url: string }>;
  release_date: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) {}

 
  searchTracks(query: string, limit: number = 20): Observable<SpotifySearchResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'track')
      .set('limit', limit.toString());

    return this.http.get<SpotifySearchResponse>(`${environment.API_URL}/search`, { params });
  }

  searchAlbums(query: string, limit: number = 10): Observable<SpotifySearchResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'album')
      .set('limit', limit.toString());

    return this.http.get<SpotifySearchResponse>(`${environment.API_URL}/search`, { params });
  }

  searchAll(query: string): Observable<SpotifySearchResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'track,album,artist')
      .set('limit', '10');

    return this.http.get<SpotifySearchResponse>(`${environment.API_URL}/search`, { params });
  }

  
  getTrack(trackId: string): Observable<SpotifyTrack> {
    return this.http.get<SpotifyTrack>(`${environment.API_URL}/tracks/${trackId}`);
  }

  
  getRecommendations(seedTracks?: string[], limit: number = 20): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString());
    
    if (seedTracks && seedTracks.length > 0) {
      params = params.set('seed_tracks', seedTracks.join(','));
    }

    return this.http.get(`${environment.API_URL}/recommendations`, { params });
  }
}