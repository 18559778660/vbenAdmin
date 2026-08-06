<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { Card } from 'ant-design-vue';

defineOptions({ name: 'PlaceholderPage' });

const route = useRoute();

const title = computed(() => String(route.meta?.title ?? '未命名页面'));
</script>

<template>
  <div class="p-5">
    <Card>
      <div
        class="flex min-h-[320px] flex-col items-center justify-center text-center"
      >
        <div class="text-foreground text-lg font-medium">{{ title }}</div>
        <div class="text-muted-foreground mt-2 text-sm">
          页面开发中，当前为占位页
        </div>
      </div>
    </Card>
  </div>
</template>
