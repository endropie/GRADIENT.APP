<template>
  <q-card>
    <q-item v-if="avatar">
      <q-item-section avatar>
        <q-skeleton type="QAvatar" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" />
        </q-item-label>
        <q-item-label caption>
          <q-skeleton type="text" />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-skeleton v-if="box" height="100px" square />

    <q-card-actions v-if="action" align="right" class="q-gutter-md">
      <q-skeleton type="QBtn" />
      <q-skeleton type="QBtn" />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'SkeletonCard',
  props: {
    avatar: Boolean,
    action: Boolean,
    box: Boolean
  }
}
</script>
