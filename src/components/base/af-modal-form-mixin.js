'use strict'
import {mapEvents} from '../../routines'
export default {
  mounted () {
    // пророс событий close/open наверх
    this.$children[0].$on('close', () => {
      // включаем обработчики событий родителя пока открыта модальная форма
      mapEvents(this.$parent, true)
      this.$emit('close')
    })
    this.$children[0].$on('open', () => {
      // отключаем обработчики событий родителя пока открыта модальная форма
      mapEvents(this.$parent, false)
      this.$emit('open')
    })
  }
}
