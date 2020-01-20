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
  y: 0,
  vy: 0
}

export { scroll, useStore }
