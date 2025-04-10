/**
 * Returns React Component of element given
 *
 * React element is instance of React component, and
 * stores its React component in `type` property.
 *
 * @see https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html
 *
 * @param {ReactElement} element React Element
 *
 * @returns {string | ReactClass}
 */
export const getComponentOfElement = element => element.type
