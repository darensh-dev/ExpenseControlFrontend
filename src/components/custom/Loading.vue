<!-- Loading.vue -->
<template>
  <div class="flex flex-col items-center justify-center w-full py-16 text-center animate-fade-in">
    <div class="relative flex items-center justify-center w-20 h-20">
      <span
        class="absolute inline-block w-full h-full rounded-full border-4 border-primary border-t-transparent animate-spin-slow"
      />
      <i class="pi pi-spinner text-primary text-4xl animate-pulse" />
    </div>
    <h2 class="mt-6 text-xl sm:text-2xl font-semibold text-gray-700">Cargando información...</h2>
    <p class="mt-1 text-sm text-gray-500">Por favor espera un momento</p>
  </div>
</template>

<style scoped>
@keyframes spin-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 1.2s linear infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-in-out;
}
</style>
