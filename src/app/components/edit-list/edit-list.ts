import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Roulette, Participant } from '../../services/roulette';

@Component({
  selector: 'app-edit-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-list.html',
  styleUrl: './edit-list.scss',
})
export class EditList {
  private rouletteService = inject(Roulette);

  participants = this.rouletteService.participants;
  newParticipantName = signal('');
  editingId = signal<number | null>(null);
  editingName = signal('');

  addParticipant(): void {
    const name = this.newParticipantName().trim();
    if (name) {
      this.rouletteService.addParticipant(name);
      this.newParticipantName.set('');
    }
  }

  removeParticipant(id: number): void {
    if (confirm('¿Estás seguro de eliminar este participante?')) {
      this.rouletteService.removeParticipant(id);
    }
  }

  startEdit(participant: Participant): void {
    this.editingId.set(participant.id);
    this.editingName.set(participant.name);
  }

  saveEdit(): void {
    const id = this.editingId();
    const name = this.editingName().trim();
    if (id !== null && name) {
      this.rouletteService.updateParticipant(id, name);
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editingName.set('');
  }

  resetList(): void {
    if (confirm('¿Estás seguro de restablecer la lista a los valores predeterminados?')) {
      this.rouletteService.resetParticipants();
    }
  }
}
