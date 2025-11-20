export const marked = {
  parse: (markdown: string) => `<p>${markdown}</p>`,
  setOptions: () => {},
}

export default {
  parse: (markdown: string) => `<p>${markdown}</p>`,
}
