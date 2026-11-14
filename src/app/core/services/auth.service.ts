import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { API_URL } from '../api.config';
import { LoginRequest, RegistroRequest, TokenResponse, Usuario } from '../models/usuario.model';

const TOKEN_KEY = 'peludos_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Estado interno
  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private _usuario = signal<Usuario | null>(null);

  // Estado público (solo lectura)
  readonly token = this._token.asReadonly();
  readonly usuario = this._usuario.asReadonly();
  readonly autenticado = computed(() => this._token() !== null);

  /** POST /auth/register */
  registrar(datos: RegistroRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${API_URL}/auth/register`, datos);
  }

  /** POST /auth/login (form-urlencoded) y luego carga el perfil */
  login(datos: LoginRequest): Observable<Usuario> {
    const body = new HttpParams()
      .set('username', datos.correo)
      .set('password', datos.contrasena);

    return this.http.post<TokenResponse>(`${API_URL}/auth/login`, body).pipe(
      tap(res => this.guardarToken(res.access_token)),
      switchMap(() => this.cargarPerfil())
    );
  }

  /** GET /usuarios/me */
  cargarPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${API_URL}/usuarios/me`).pipe(
      tap(usuario => this._usuario.set(usuario))
    );
  }

  /** Actualiza el usuario en memoria (después de editar el perfil) */
  establecerUsuario(usuario: Usuario): void {
    this._usuario.set(usuario);
  }

  cerrarSesion(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
    this._usuario.set(null);
    this.router.navigate(['/login']);
  }

  private guardarToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this._token.set(token);
  }
}