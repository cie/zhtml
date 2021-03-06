import './z-window.svelte'
import './z-canvas.svelte'
import './z-fig.svelte'

import { Point } from './math/Point'
import * as penner from 'penner'
window.Point = Point
window.penner = penner

function prop (name, syntax, initialValue, inherits = false) {
  CSS.registerProperty({ name, syntax, inherits, initialValue })
}
prop('--z-x', '<number>', '0')
prop('--z-y', '<number>', '0')
prop('--z-scale', '<number>', '1')
prop('--z-zoom', '<number>', '1', true)
prop('--z-delay', '<time>', '1s', true)
prop('--z-parent-zoom', '<number>', '1', true)
