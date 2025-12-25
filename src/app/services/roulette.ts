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
    return Array.from({ length: 32 }, (_, i) => ({
      id: i + 1,
      name: `${i + 1}`,
      color: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`,
    }));
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.participants()));
    }
  }

  addParticipant(name: string): void {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E2',
      '#F06292',
      '#AED581',
    ];
    const newId = Math.max(...this.participants().map((p) => p.id), 0) + 1;
    const color = colors[newId % colors.length];

    this.participants.update((list) => [...list, { id: newId, name, color }]);
    this.saveToStorage();
  }

  removeParticipant(id: number): void {
    this.participants.update((list) => list.filter((p) => p.id !== id));
    this.saveToStorage();
  }

  updateParticipant(id: number, name: string): void {
    this.participants.update((list) => list.map((p) => (p.id === id ? { ...p, name } : p)));
    this.saveToStorage();
  }

  resetParticipants(): void {
    this.participants.set(this.getDefaultParticipants());
    this.saveToStorage();
  }
}
