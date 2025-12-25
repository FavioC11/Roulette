import { Injectable, signal } from '@angular/core';

export interface Participant {
  id: number;
  name: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class Roulette {
  private readonly STORAGE_KEY = 'roulette-participants';

  participants = signal<Participant[]>(this.loadFromStorage());

  private loadFromStorage(): Participant[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return this.getDefaultParticipants();
  }

  private getDefaultParticipants(): Participant[] {
    return [
      { id: 1, name: 'Participante 1', color: '#FF6B6B' },
      { id: 2, name: 'Participante 2', color: '#4ECDC4' },
      { id: 3, name: 'Participante 3', color: '#45B7D1' },
      { id: 4, name: 'Participante 4', color: '#FFA07A' },
      { id: 5, name: 'Participante 5', color: '#98D8C8' },
      { id: 6, name: 'Participante 6', color: '#F7DC6F' },
      { id: 7, name: 'Participante 7', color: '#BB8FCE' },
      { id: 8, name: 'Participante 8', color: '#85C1E2' },
    ];
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.participants()));
    }
  }

  addParticipant(name: string): void {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F06292', '#AED581'];
    const newId = Math.max(...this.participants().map(p => p.id), 0) + 1;
    const color = colors[newId % colors.length];

    this.participants.update(list => [...list, { id: newId, name, color }]);
    this.saveToStorage();
  }

  removeParticipant(id: number): void {
    this.participants.update(list => list.filter(p => p.id !== id));
    this.saveToStorage();
  }

  updateParticipant(id: number, name: string): void {
    this.participants.update(list =>
      list.map(p => p.id === id ? { ...p, name } : p)
    );
    this.saveToStorage();
  }

  resetParticipants(): void {
    this.participants.set(this.getDefaultParticipants());
    this.saveToStorage();
  }
}
