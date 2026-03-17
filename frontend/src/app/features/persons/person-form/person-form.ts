import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Persons } from '../../../core/api/persons';
import { Router } from '@angular/router';
import { BIRTHDAY_EMOJIS } from '../../../shared/constants/emoji';

@Component({
  selector: 'app-person-form',
  imports: [ReactiveFormsModule],
  templateUrl: './person-form.html',
  styleUrl: './person-form.css',
})
export class PersonForm {
  private personService = inject(Persons);
  private router = inject(Router);

  emojis = BIRTHDAY_EMOJIS;
  today = new Date().toISOString().split('T')[0];

  selectedEmoji = signal('🎂');
  isLoading = signal(false);

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    emoji: new FormControl('🎂', [Validators.required]),
    date: new FormControl('', [Validators.required]),
  });
  get name() {
    return this.formGroup.controls.name;
  }
  get date() {
    return this.formGroup.controls.date;
  }

  onSubmit() {
    if (this.formGroup.invalid) return;

    const { name, emoji, date } = this.formGroup.value;

    this.isLoading.set(true);

    this.personService
      .create({
        name: name!,
        emoji: emoji!,
        date: date!,
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('Fehler beim Anlegen', err);
        },
      });
  }

  selectEmoji(emoji: string) {
    this.selectedEmoji.set(emoji);
    this.formGroup.controls.emoji.setValue(emoji);
  }

  routeToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
