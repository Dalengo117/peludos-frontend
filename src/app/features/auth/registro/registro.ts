import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { mensajeError } from '../../../core/http-error';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  cargando = signal(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    nombre_completo: ['', [Validators.required, Validators.minLength(3)]],
    correo_electronico: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
    telefono: [''],
    direccion: ['']
  });

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.auth.registrar(this.form.getRawValue()).subscribe({
      next: () => {
        // Si el registro es exitoso, lo enviamos al login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error.set(mensajeError(err, 'No se pudo crear la cuenta'));
        this.cargando.set(false);
      }
    });
  }

  invalido(campo: 'nombre_completo' | 'correo_electronico' | 'contrasena'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }
}