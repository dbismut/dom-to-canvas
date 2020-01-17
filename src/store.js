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
  vy: 0,
  vy_lerp: 0,
  top_lerp: 0,
  tick() {
    this.vy_lerp = lerp(this.vy_lerp, this.vy, 0.1)
    this.top_lerp = lerp(this.top_lerp, this.top, 0.1)
  }
}

export { scroll, useStore }
