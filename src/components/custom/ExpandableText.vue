<template>
  <p>
    {{ isExpanded ? text : truncatedText }}
    <span v-if="isLongText && !isExpanded">...</span>
    <button v-if="isLongText" @click="isExpanded = !isExpanded" class="ml-1 text-blue-500 underline">
      {{ isExpanded ? "ver menos" : "ver más" }}
    </button>
  </p>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  maxLength: {
    type: Number,
    default: 60,
  },
});

const isExpanded = ref(false);

const isLongText = computed(() => props.text.length > props.maxLength);
const truncatedText = computed(() => props.text.slice(0, props.maxLength));
</script>
