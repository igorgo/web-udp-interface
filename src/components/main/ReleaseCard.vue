<template>
  <q-card>
    <q-card-title :class="'text-' + colorT">
      {{rtype === 'stable' ? 'Стабільниий' : 'Бета'}}
      <span slot="subtitle"
            v-show="releasesLoaded">{{release['releaseName']}} (розпочато {{release['releaseDate']}})</span>
    </q-card-title>
    <q-card-main>
      <q-transition
        appear
        enter="fadeIn"
        leave="fadeOut"
      >
        <div v-show="releasesLoaded">
          <table style="margin-bottom: 10px;">
            <tr>
              <td class="text-bold">Відкритих рекламацій:</td>
              <td class="text-right">{{release['openedIssues']}}</td>
            </tr>
            <tr>
              <td class="text-bold">Закрито рекламацій:</td>
              <td class="text-right">{{release['closedIssues']}}</td>
            </tr>
          </table>
          <div v-if="release.lastBuildNumber">
            <p>Остання збірка: {{release['lastBuildNumber']}} від {{release['lastBuildDate']}}</p>
            <p><a :href="rtype === 'stable' ? stableUrl : betaUrl" target="_blank">Завантажити з Google диску</a></p>
          </div>
          <div v-else>Збірка не здійснювалась</div>
        </div>
      </q-transition>
    </q-card-main>
    <q-inner-loading :visible="!releasesLoaded">
      <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
    </q-inner-loading>
  </q-card>
</template>

<script>
  import {
    QCard,
    QCardTitle,
    QCardMain,
    QTransition,
    QSpinnerGears,
    QInnerLoading
  } from 'quasar'
  import c from '../../constants'
  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        stableUrl: c.STABLE_DOWNLOAD_URL,
        betaUrl: c.BETA_DOWNLOAD_URL
      }
    },
    props: ['rtype'],
    components: {
      QCard,
      QCardTitle,
      QCardMain,
      QTransition,
      QSpinnerGears,
      QInnerLoading
    },
    computed: {
      ...mapState({
        releasesLoaded: state => state.main.releasesLoaded
      }),
      colorT () {
        return this.$props.rtype === 'stable' ? 'positive' : 'warning'
      },
      release () {
        return this.$store.state.main.curReleases[this.$props.rtype]
      }
    },
    name: 'udp-release-card'
  }
</script>

<style>
</style>
