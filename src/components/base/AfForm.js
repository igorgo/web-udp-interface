'use strict'

export default {
  name: 'af-form',
  functional: true,
  props: {
    square: Boolean,
    flat: Boolean,
    inline: Boolean,
    color: String,
    title: String
  },
  render (h, ctx) {
    const
      data = ctx.data,
      classes = data.staticClass,
      prop = ctx.props,
      slots = ctx.slots()

    let cls = ['q-card']
    if (prop.square) {
      cls.push('no-border-radius')
    }
    if (prop.flat) {
      cls.push('no-shadow')
    }
    if (prop.inline) {
      cls.push('inline-block')
    }
    if (prop.color) {
      cls.push(`bg-${prop.color} text-white q-card-dark`)
    }

    data.staticClass = `${cls.join(' ')}${classes ? ` ${classes}` : ''}`

    return h(
      'div',
      data,
      [
        h('div', { staticClass: 'q-card-primary q-card-container row no-wrap' }, [
          h('div', { staticClass: 'col column' }, [
            h('div', { staticClass: 'q-card-title' }, slots.default),
            h('div', { staticClass: 'q-card-subtitle' }, slots.subtitle)
          ]),
          h('div', { staticClass: 'col-auto self-center q-card-title-extra' }, slots.right)
        ]),
        ctx.children
      ]
    )
  }
}
