import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink],
  template: ` <div
    class="flex items-center justify-center h-full text-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-fade-in"
  >
    <div>
      <h1 class="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4">
        Welcome to <span class="text-yellow-300">NextConnect</span>
      </h1>
      <p class="text-xl md:text-2xl text-white mb-6">
        Start Chat & Enjoy the Experience 🚀
      </p>
      <button
        routerLink="/home/single-chat"
        class="px-6 py-2 bg-white text-indigo-700 font-semibold rounded-full shadow-md hover:bg-yellow-300 transition"
      >
        Start Now
      </button>
    </div>
  </div>`,
})
export class WelcomeComponent {}
