<template>
  <Card>
    <template #content>
      <div class="flex flex-col gap-2">
        <Skeleton width="13rem" height="2rem" class="" />
        <Skeleton width="8rem" height="1.5rem" />
      </div>
      <div class="flex gap-3 justify-between mt-4">
        <div class="flex flex-col gap-2 w-full">
          <Skeleton width="13rem" height="1rem" class="" />
          <Skeleton width="13rem" height="1rem" class="" />
          <Skeleton height="4rem" class="" />
        </div>
        <div class="flex flex-col gap-4">
          <Skeleton width="2rem" height="2rem" />
          <Skeleton width="2rem" height="2rem" />
        </div>
      </div>
    </template>
  </Card>
</template>
