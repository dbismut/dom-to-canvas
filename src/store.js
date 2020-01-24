import create from 'zustand'
import lerp from 'lerp'

const [useStore] = create(set => ({
  objects: {},
  props: {},
  updateProps: (id, props) =>
    set(state => ({ ...state, props: { ...state.props, [id]: { ...state.props[id], ...props } } })),
  addObject: (id, object) => set(state => ({ ...state, objects: { ...state.objects, [id]: object } })),
  removeObject: id =>
    set(state => {
      const { [id]: _o, ...objects } = state.objects
      const { [id]: _p, ...props } = state.props
      return { ...state, objects, props }
    })
}))

const scroll = {
  zoom: 1,
  top: 0,
  lerped: { top: 0 },
  velo: { top: 0 },
  tick() {
    this.lerped.top = lerp(this.lerped.top, this.top, 0.1)
    this.velo.top = 65e-5 * (this.top - this.lerped.top)
  }
}

const bounds = { vw: 0, vh: 0 }

const pointer = {
  x: 0,
  y: 0,
  lerped: { x: 0, y: 0 },
  gl: { x: 0, y: 0 },
  velo: { x: 0, y: 0, abs: 0 },
  tick() {
    this.lerped.x = lerp(this.lerped.x, this.x, 0.1)
    this.lerped.y = lerp(this.lerped.y, this.y, 0.1)
    this.velo.x = this.x - this.lerped.x
    this.velo.y = this.y - this.lerped.y
    this.velo.abs = 65e-5 * Math.max(Math.abs(this.velo.x), Math.abs(this.velo.y))
    this.gl.x = this.lerped.x / bounds.vw
    this.gl.y = 1 - this.lerped.y / bounds.vh
  }
}

window.pointer = pointer

export { scroll, pointer, bounds, useStore }
