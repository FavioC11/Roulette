import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Roulette as RouletteService } from '../../services/roulette';

@Component({
  selector: 'app-roulette',
  imports: [CommonModule, RouterModule],
  templateUrl: './roulette.html',
  styleUrl: './roulette.scss',
})
export class Roulette {
  private rouletteService = inject(RouletteService);

  participants = this.rouletteService.participants;
  isSpinning = signal(false);
  rotation = signal(0);
  winner = signal<string | null>(null);
  showFireworks = signal(false);

  canSpin = computed(() => this.participants().length > 0 && !this.isSpinning());

  private spinSound: HTMLAudioElement | null = null;
  private winSound: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.createSounds();
    }
  }

  private createSounds(): void {
    const audioContext = typeof AudioContext !== 'undefined' ? new AudioContext() : null;
    if (!audioContext) return;

    this.spinSound = new Audio();
    this.spinSound.src = this.createSpinSoundDataURL();

    this.winSound = new Audio();
    this.winSound.src = this.createWinSoundDataURL();
  }

  private createSpinSoundDataURL(): string {
    return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==';
  }

  private createWinSoundDataURL(): string {
    return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
  }

  spinWheel(): void {
    if (!this.canSpin()) return;

    const participantsList = this.participants();
    if (participantsList.length === 0) return;

    this.isSpinning.set(true);
    this.winner.set(null);

    if (this.spinSound) {
      this.spinSound.play().catch(() => {});
    }

    const winnerIndex = Math.floor(Math.random() * participantsList.length);
    const segmentAngle = 360 / participantsList.length;
    const extraSpins = 5;
    const targetRotation = extraSpins * 360 + (360 - (winnerIndex * segmentAngle + segmentAngle / 2));

    this.rotation.set(this.rotation() + targetRotation);

    setTimeout(() => {
      this.isSpinning.set(false);
      const winnerParticipant = participantsList[winnerIndex];
      this.winner.set(winnerParticipant.name);
      this.showFireworks.set(true);

      if (this.winSound) {
        this.winSound.play().catch(() => {});
      }

      setTimeout(() => {
        this.showFireworks.set(false);
        this.rouletteService.removeParticipant(winnerParticipant.id);
      }, 4000);
    }, 4000);
  }

  getSegmentAngle(): number {
    const count = this.participants().length;
    return count > 0 ? 360 / count : 0;
  }

  getSegmentPath(index: number): string {
    const angle = this.getSegmentAngle();
    const startAngle = index * angle - 90; // -90 para empezar desde arriba
    const endAngle = (index + 1) * angle - 90;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const centerX = 100;
    const centerY = 100;
    const radius = 100;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  }

  getTextX(index: number): number {
    const angle = this.getSegmentAngle();
    const middleAngle = (index * angle + angle / 2 - 90) * Math.PI / 180;
    return 100 + 60 * Math.cos(middleAngle);
  }

  getTextY(index: number): number {
    const angle = this.getSegmentAngle();
    const middleAngle = (index * angle + angle / 2 - 90) * Math.PI / 180;
    return 100 + 60 * Math.sin(middleAngle);
  }

  getTextTransform(index: number): string {
    const angle = this.getSegmentAngle();
    const middleAngle = index * angle + angle / 2;
    const textX = this.getTextX(index);
    const textY = this.getTextY(index);
    return `rotate(${middleAngle}, ${textX}, ${textY})`;
  }
}
